<?php

namespace App\Controllers\DenunciasConsumidor\v1;

use CodeIgniter\RESTful\ResourceController;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use App\Models\DenunciasConsumidor\v1\AdministradorModel;
use App\Controllers\DenunciasConsumidor\v1\AuthController;
use CodeIgniter\Config\Services;

class AdminsController extends ResourceController
{
    // Models
    private $denuncianteModel;
    private $denunciaModel;
    private $seguimientoDenunciaModel;
    private $adminModel;
    //private $historialModel;

    // Utils
    private $email;
    private $AuthController;

    public function __construct()
    {
        // Modelos de denuncias
        $this->denuncianteModel          = new DenuncianteModel();
        $this->denunciaModel             = new DenunciaModel();
        $this->seguimientoDenunciaModel  = new SeguimientoDenunciaModel();

        // Modelos de admins
        $this->adminModel     = new AdministradorModel();
        //$this->historialModel = new HistorialAdminModel();

        // Servicios
        $this->email         = Services::email();
        $this->AuthController = new AuthController();
    }

    private function authAdmin()
    {
        $token = get_cookie('access_token');

        if (!$token) {
            return $this->respond(['error' => 'No autenticado'], 401);
        }

        try {
            $decoded = verifyJWT($token);

            if (!isset($decoded->data->dni)) {
                return $this->respond(['error' => 'Token inválido'], 401);
            }

            // Buscar el admin en la BD
            $adminModel = new \App\Models\DenunciasConsumidor\v1\AdministradorModel();
            $admin = $adminModel->where('dni', $decoded->data->dni)->first();

            if (!$admin) {
                return $this->respond(['error' => 'Admin no encontrado'], 404);
            }

            return $admin; 


        } catch (\Throwable $e) {
            return $this->respond(['error' => 'Token inválido: ' . $e->getMessage()], 401);
        }
    }

    
    private function isSuperAdmin($admin)
    {
        return isset($admin['rol']) && $admin['rol'] === 'super_admin';
    }

    private function isAdmin($admin)
    {
        return isset($admin['rol']) && $admin['rol'] === 'admin';
    }


    //==========================
    // Funciones de ADMINs
    //==========================
    
    public function recibirAdmin()
    {
        
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true); 

        $code       = $input['tracking_code'] ?? null;
        $estado     = 'recibida'; 
        $comentario = 'La denuncia ha sido recibida por el administrador'; 

        if (empty($code)) {
            return $this->fail(['message' => 'Faltan parámetros requeridos']);
        }

        $seguimientoData = [
            'administrador_id' => $admin['id'],
            'estado'             => $estado,
            'comentario'         => $comentario,
        ];

        $denuncia = $this->denunciaModel->recibirDenuncia(
            $code,
            $estado,
            $comentario,
            $seguimientoData
        );

        if (!$denuncia) {
            return $this->respond([
                'success' => false,
                'message' => 'No se encontró la denuncia con el código ingresado.'
            ], 404);
        }

        return $this->respond([
            'success' => true,
            'message' => 'Denuncia recibida correctamente',
            'denuncia'=> $denuncia
        ]);
    }

    public function procesosDenuncia()
    {

        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true); 

        $code       = $input['tracking_code'] ?? null;
        $estado     = $input['estado'] ?? null;
        $comentario = $input['comentario'] ?? null;

        if (empty($code) || empty($estado) || empty($comentario)) {
            return $this->fail(['message' => 'Faltan parámetros requeridos']);
        }

        if (!$code) {
            return $this->fail(['message' => 'Falta el tracking_code en el request']);
        }

        $denuncia = $this->denunciaModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->fail(['message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id'     => $denuncia['id'],
            'administrador_id' => $admin['id'], 
            'comentario'      => $comentario
        ]);

        $this->denunciaModel
            ->where('tracking_code', $code)
            ->set(['estado' => $estado])
            ->update();

        $correo = $this->denuncianteModel
            ->select('email')
            ->where('id', $denuncia['denunciante_id'])
            ->first();

        if ($correo) {
            $this->enviarCorreo($correo['email'], $code, $estado, $comentario);
        }

        return $this->respond(['success' => true, 'message' => 'Denuncia actualizada']);
    }

    public function searchDenuncias($documento = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($documento)) {
            return $this->fail(['message' => 'Falta el parámetro documento']);
        }

        $denuncias = $this->denunciaModel->searchByDocumento($documento);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias con este documento']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    public function searchDenunciasByDenuncianteId($denuncianteId = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($denuncianteId)) {
            return $this->fail(['message' => 'Falta el parámetro denunciante_id']);
        }

        $denuncias = $this->denunciaModel->searchByDenuncianteId($denuncianteId);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias para este denunciante']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    public function getRegistradas(){
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = $this->request->getGet('per_page') ?? 10;
        $page = $this->request->getGet('page') ?? 1;

        $denuncias = $this->denunciaModel->DenunciasRegistradas($perPage);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias registradas']);
        }

        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data' => $denuncias,
            'pager' => $this->denunciaModel->pager->getDetails() 
        ]);
    }

    public function getdenunciasActivas()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = $this->request->getGet('per_page') ?? 10;
        $page = $this->request->getGet('page') ?? 1;

        $denuncias = $this->denunciaModel->DenunciasActivas($perPage);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias activas']);
        }
        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data' => $denuncias,
            'pager' => $this->denunciaModel->pager->getDetails()
        ]);
    }


    // =========================
    // Funciones de SUPER ADMINS
    // =========================
    public function getAdministradores()
    {
        $admins = $this->adminModel->findAll();
        if (!$admins) {
            return $this->response->setJSON(['error' => 'No se encontraron administradores'])->setStatusCode(404);
        }
        return $this->response->setJSON($admins);
    }

    
    public function createAdministrador()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para crear administradores'], 403);
        }

        $input = $this->request->getJSON(true);

        $adminData = [
            'dni'      => $input['dni'] ?? null,
            'nombre'   => $input['nombre'] ?? null,
            'password' => isset($input['password']) ? password_hash($input['password'], PASSWORD_DEFAULT) : null,
            'rol'      => $input['rol'] ?? null,
            'estado'   => $input['estado'] ?? null,
        ];

        // Verificar si ya existe un administrador con ese DNI
        if (!empty($adminData['dni']) && $this->adminModel->getByDNI($adminData['dni'])) {
            return $this->fail([
                'success' => false,
                'error' => 'Ya existe un administrador con ese DNI'
            ], 400);
        }

        if ($this->adminModel->insert($adminData)) {
            return $this->respondCreated([
                'success' => true,
                'message' => 'Administrador registrado correctamente',
                'id'      => $this->adminModel->getInsertID()
            ]);
        }

        return $this->fail([
            'success' => false,
            'error' => 'Error al crear el administrador',
            'details' => $this->adminModel->errors()
        ], 500);
    }


    public function updateAdministrador($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para actualizar administradores'], 403);
        }

        $input = $this->request->getJSON(true);

        // Verificar si el admin existe por DNI
        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->failNotFound("Administrador con DNI {$dni} no encontrado");
        }

        // Filtramos solo los campos permitidos en el modelo
        $data = array_intersect_key($input, array_flip($this->adminModel->allowedFields));

        if (empty($data)) {
            return $this->failValidationErrors("No se enviaron campos válidos para actualizar");
        }

        // Hashear la contraseña 
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // Ejecutamos el update usando el DNI
        if ($this->adminModel->where('dni', $dni)->set($data)->update()) {
            return $this->respondUpdated([
                'success' => true,
                'message' => "Administrador actualizado correctamente",
                'data'    => $this->adminModel->getByDNI($dni)
            ]);
        }

        return $this->fail("No se pudo actualizar el administrador");
    }


    public function deleteAdministrador($dni)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para eliminar administradores'], 403);
        }

        if (!$dni) {
            return $this->fail(['error' => 'Debe proporcionar un DNI'], 400);
        }

        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->fail(['error' => 'Administrador no encontrado'], 404);
        }

        if ($this->adminModel->where('dni', $dni)->delete()) {
            return $this->respondDeleted([
                'message' => 'Administrador eliminado correctamente',
                'dni'     => $dni
            ]);
        }

        return $this->fail([
            'error' => 'No se pudo eliminar el administrador'
        ], 500);
    }

    public function deleteAdministradorById($id)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para eliminar administradores'], 403);
        }

        if (!$id) {
            return $this->fail(['error' => 'Debe proporcionar un ID'], 400);
        }

        $admin = $this->adminModel->find($id);
        if (!$admin) {
            return $this->fail(['error' => 'Administrador no encontrado'], 404);
        }

        if ($this->adminModel->delete($id)) {
            return $this->respondDeleted([
                'message' => 'Administrador eliminado correctamente',
                'id'      => $id
            ]);
        }

        return $this->fail([
            'error' => 'No se pudo eliminar el administrador'
        ], 500);
    }



    public function searchAdminByDNI($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin; 

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$dni) {
            return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
        }

        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }
        return $this->response->setJSON($admin);
    }

    public function searchAdminById($id)
    {
        
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$id) {
            return $this->response->setJSON(['error' => 'ID no proporcionado'])->setStatusCode(400);
        }
        
        $admin = $this->adminModel->find($id);

        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }

        return $this->response->setJSON($admin);
    }


    // =========================
    // 📧 Función auxiliar
    // =========================
    // private function enviarCorreo($correo, $code, $estado, $comentario)
    // {
    //     $this->email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
    //     $this->email->setTo($correo);
    //     $this->email->setSubject('Código de Seguimiento de Denuncia');
    //     $this->email->setMessage("
    //         <html><body>
    //         <p>Estimado usuario,</p>
    //         <p>Estado actual de su denuncia:</p>
    //         <p><strong>Código:</strong> $code</p>
    //         <p><strong>Estado:</strong> $estado</p>
    //         <p><strong>Comentario:</strong> $comentario</p>
    //         <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Ver seguimiento</a></p>
    //         </body></html>
    //     ");
    //     return $this->email->send();
    // }

    //====================================
    // METODO PRIVADO PARA ENVIO DE CORREO
    //==================================== 
    private function enviarCorreo($correo, $code, $estado, $comentario)
    {
        $email = \Config\Services::email();

        $email->setFrom('anaga123op@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $email->setTo($correo);
        $email->setSubject('Código de Seguimiento de Denuncia');

        $mensaje = "
            <html><body>
            <p>Estimado usuario,</p>
            <p>Estado actual de su denuncia: $estado</p>
            <p><strong>Código:</strong> $code</p>
            <p><strong>Estado:</strong> $estado</p>
            <p><strong>Comentario:</strong> $comentario</p>
            <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Ver seguimiento</a></p>
            </body></html>
        ";

        $email->setMessage($mensaje);

        if($email->send()){
            return true;
        } else {
            return $email->printDebugger(['headers']);
        }
    }
}
