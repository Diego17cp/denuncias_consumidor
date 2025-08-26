<?php

namespace App\Controllers\DenunciasConsumidor\v1;

use CodeIgniter\RESTful\ResourceController;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use App\Models\DenunciasConsumidor\v1\AdjuntoModel;
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
    private $adjuntoModel;
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
        $this->adjuntoModel              = new AdjuntoModel();

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
    
    // public function recibirAdmin()
    // {
        
    //     $admin = $this->authAdmin();
    //     if (is_object($admin)) return $admin;

    //     $input = $this->request->getJSON(true); 

    //     $code       = $input['tracking_code'] ?? null;
    //     $estado     = 'recibida'; 
    //     $comentario = 'La denuncia ha sido recibida por el administrador'; 

    //     if (empty($code)) {
    //         return $this->fail(['message' => 'Faltan parámetros requeridos']);
    //     }

    //     $seguimientoData = [
    //         'administrador_id' => $admin['id'],
    //         'estado'             => $estado,
    //         'comentario'         => $comentario,
    //     ];

    //     $denuncia = $this->denunciaModel->recibirDenuncia(
    //         $code,
    //         $estado,
    //         $comentario,
    //         $seguimientoData
    //     );

    //     if (!$denuncia) {
    //         return $this->respond([
    //             'success' => false,
    //             'message' => 'No se encontró la denuncia con el código ingresado.'
    //         ], 404);
    //     }

    //     return $this->respond([
    //         'success' => true,
    //         'message' => 'Denuncia recibida correctamente',
    //         'denuncia'=> $denuncia
    //     ]);
    // }

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
            'estado'           => $estado,
            'comentario'       => $comentario,
        ];

        $resultado = $this->denunciaModel->recibirDenuncia(
            $code,
            $estado,
            $comentario,
            $seguimientoData
        );

        if (!$resultado) {
            return $this->respond([
                'success' => false,
                'message' => 'No se encontró la denuncia con el código ingresado.'
            ], 404);
        }

        $denuncia = $resultado['denuncia'];
        $correo = null;

        if (!empty($denuncia['denunciante_id'])) {
            $denunciante = $this->denuncianteModel->find($denuncia['denunciante_id']);
            if ($denunciante && !empty($denunciante['correo'])) {
                $correo = $denunciante['correo'];
            }
        }

        if ($correo) {
            $enviado = $this->enviarCorreo($correo, $code, $estado, $comentario);
            if ($enviado !== true) {
                log_message('error', 'Error al enviar correo: ' . print_r($enviado, true));
            }
        }

        return $this->respond([
            'success'    => true,
            'message'    => 'Denuncia recibida correctamente',
            'denuncia'   => $resultado['denuncia'],
            'seguimiento'=> $resultado['seguimiento']
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
            'comentario'      => $comentario,
            'estado'           => $estado,
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

    
    //===========================
    // FUNCION PARA BUSCAR DENUNCIA
    // POR DOCUMENTO DEL DENUNCIADO
    //===========================
    public function searchDenunciaByDocumentoDenunciado($documento = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($documento)) {
            return $this->fail(['message' => 'Falta el parámetro documento del denunciado']);
        }

        $denuncias = $this->denunciaModel->searchByDocumentoDenunciado($documento);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontró ninguna denuncia para este documento']);
        }

        // Construimos un array limpio para la respuesta
        $data = array_map(function ($denuncia) {
            return [
                'id'             => $denuncia['id'],
                'tracking_code'  => $denuncia['tracking_code'],
                'estado'         => $denuncia['estado'],
                'descripcion'    => $denuncia['descripcion'],
                'fecha_incidente'=> $denuncia['fecha_incidente'],
                'lugar'          => $denuncia['lugar'],
                'denunciante' => [
                    'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                    'documento' => $denuncia['documento_denunciante'] ?? 'No especificado',
                ],
                'denunciado' => [
                    'nombre'    => $denuncia['nombre_denunciado'],
                    'documento' => $denuncia['documento_denunciado'],
                ],
                'created_at' => $denuncia['created_at'],
            ];
        }, $denuncias);

        return $this->respond(['success' => true, 'data' => $data]);
    }

    public function searchDenunciaByNombreDenunciado($nombre = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (empty($nombre)) {
            return $this->fail(['message' => 'Falta el parámetro nombre del denunciado']);
        }

        $denuncias = $this->denunciaModel->searchByNombreDenunciado($nombre);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontró ninguna denuncia para este nombre']);
        }

        // Construimos la respuesta
        $data = array_map(function ($denuncia) {
            return [
                'id'             => $denuncia['id'],
                'tracking_code'  => $denuncia['tracking_code'],
                'estado'         => $denuncia['estado'],
                'descripcion'    => $denuncia['descripcion'],
                'fecha_incidente'=> $denuncia['fecha_incidente'],
                'lugar'          => $denuncia['lugar'],
                'denunciante' => [
                    'nombre'    => $denuncia['nombre_denunciante'] ?? 'Anónimo',
                    'documento' => $denuncia['documento_denunciante'] ?? 'No especificado',
                ],
                'denunciado' => [
                    'nombre'    => $denuncia['nombre_denunciado'],
                    'documento' => $denuncia['documento_denunciado'],
                ],
                'created_at' => $denuncia['created_at'],
            ];
        }, $denuncias);

        return $this->respond(['success' => true, 'data' => $data]);
    }


    

    // public function getRegistradas(){
    //     $admin = $this->authAdmin();
    //     if (is_object($admin)) return $admin;

    //     $perPage = $this->request->getGet('per_page') ?? 10;
    //     $page = $this->request->getGet('page') ?? 1;

    //     $denuncias = $this->denunciaModel->DenunciasRegistradas($perPage);

    //     if (empty($denuncias)) {
    //         return $this->fail(['message' => 'No hay denuncias registradas']);
    //     }

    //     return $this->response->setStatusCode(200)->setJSON([
    //         'success' => true,
    //         'data' => $denuncias,
    //         'pager' => $this->denunciaModel->pager->getDetails() 
    //     ]);
    // }

    public function getRegistradas($page = 1)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = 2; // Para prueba

        // Primero llamamos paginate (esto crea el pager)
        $denuncias = $this->denunciaModel->DenunciasRegistradas($perPage, $page);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias registradas']);
        }

        // Ahora que paginate ya se ejecutó, el pager existe
        $pager = $this->denunciaModel->pager;

        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data' => array_map(function ($denuncia) {
                return [
                    'id' => $denuncia['id'],
                    'tracking_code' => $denuncia['tracking_code'],
                    'estado' => $denuncia['estado'],
                    'descripcion' => $denuncia['descripcion'],
                    'fecha_incidente' => $denuncia['fecha_incidente'],
                    'lugar' => $denuncia['lugar'],
                    'denunciante' => $denuncia['denunciante_nombre'] ?? 'Anónimo',
                    'denunciado' => $denuncia['denunciado_nombre'] ?? 'Desconocido',
                    'created_at' => $denuncia['created_at']
                ];
            }, $denuncias),
            'pager' => [
                'currentPage' => $page,
                'perPage' => $perPage,
                'total' => $pager->getTotal(),
                'pageCount' => ceil($pager->getTotal() / $perPage),
                'next' => $page < ceil($pager->getTotal() / $perPage) ? base_url("admin/registradas/" . ($page + 1)) : null,
                'prev' => $page > 1 ? base_url("admin/registradas/" . ($page - 1)) : null
            ]
        ]);
    }


    // public function getdenunciasActivas()
    // {
    //     $admin = $this->authAdmin();
    //     if (is_object($admin)) return $admin;

    //     $perPage = $this->request->getGet('per_page') ?? 10;
    //     $page = $this->request->getGet('page') ?? 1;

    //     $denuncias = $this->denunciaModel->DenunciasActivas($perPage);

    //     if (empty($denuncias)) {
    //         return $this->fail(['message' => 'No hay denuncias activas']);
    //     }
    //     return $this->response->setStatusCode(200)->setJSON([
    //         'success' => true,
    //         'data' => $denuncias,
    //         'pager' => $this->denunciaModel->pager->getDetails()
    //     ]);
    // }

    public function getDenunciasActivas($page = 1)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $perPage = 2; 

        $denuncias = $this->denunciaModel->DenunciasActivas($perPage, $page);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No hay denuncias activas']);
        }

        $pager = $this->denunciaModel->pager;

        // Armamos el payload incluyendo historial (seguimientos) y adjuntos (archivos)
        $data = [];
        foreach ($denuncias as $denuncia) {
            // Conteos
            $historialCount = $this->seguimientoDenunciaModel
                ->where('denuncia_id', $denuncia['id'])
                ->countAllResults();

            $adjuntosCount = $this->adjuntoModel
                ->where('denuncia_id', $denuncia['id'])
                ->countAllResults();

            $data[] = [
                'id'             => $denuncia['id'],
                'tracking_code'  => $denuncia['tracking_code'],
                'estado'         => $denuncia['estado'],
                'descripcion'    => $denuncia['descripcion'],
                'fecha_incidente'=> $denuncia['fecha_incidente'],
                'lugar'          => $denuncia['lugar'],
                'denunciante' => [
                    'nombre'    => $denuncia['denunciante_nombre']    ?? 'Anónimo',
                    'documento' => $denuncia['denunciante_documento'] ?? 'No especificado',
                ],
                'denunciado' => [
                    'nombre'    => $denuncia['denunciado_nombre']    ?? 'Desconocido',
                    'documento' => $denuncia['denunciado_documento'] ?? 'No especificado',
                ],
                'historial' => $historialCount,   
                'adjuntos'  => $adjuntosCount,    
                'created_at'=> $denuncia['created_at'],
            ];
        }

        return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'data'    => $data,
            'pager'   => [
                'currentPage' => (int) $page,
                'perPage'     => (int) $perPage,
                'total'       => $pager->getTotal(),
                'pageCount'   => (int) ceil($pager->getTotal() / $perPage),
                'next'        => $page < ceil($pager->getTotal() / $perPage) ? base_url("admin/activas/" . ($page + 1)) : null,
                'prev'        => $page > 1 ? base_url("admin/activas/" . ($page - 1)) : null,
            ],
        ]);
    }



    // =========================
    // Funciones de SUPER ADMINS
    // =========================
    public function getAdministradores()
    {
        $admins = $this->adminModel->findAll();

        if (!$admins) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'No se encontraron administradores'])
                ->setStatusCode(404);
        }

        $filteredAdmins = array_map(function ($admin) {
            unset($admin['id'], $admin['password']);
            return $admin;
        }, $admins);

        return $this->response->setJSON([
            'success' => true,
            'data' => $filteredAdmins
        ])->setStatusCode(200);
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
        $adminAuth = $this->authAdmin();
        if (is_object($adminAuth)) return $adminAuth;

        if (!$this->isSuperAdmin($adminAuth)) {
            return $this->fail([
                'success' => false,
                'error' => 'No tienes permisos para actualizar administradores'
            ], 403);
        }

        if (!$dni) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'DNI no proporcionado'])
                ->setStatusCode(400);
        }

        $input = $this->request->getJSON(true);

        // Verificar si el admin existe
        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->failNotFound("Administrador con DNI {$dni} no encontrado");
        }

        // Solo permitimos actualizar estos campos
        $allowedUpdateFields = ['password', 'estado', 'rol'];
        $data = array_intersect_key($input, array_flip($allowedUpdateFields));

        if (empty($data)) {
            return $this->failValidationErrors("Solo puedes actualizar password, estado o rol");
        }

        // Hashear la contraseña si se envía
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // Ejecutamos el update usando el DNI
        if ($this->adminModel->where('dni', $dni)->set($data)->update()) {
            $adminUpdated = $this->adminModel->getByDNI($dni);
            unset($adminUpdated['id'], $adminUpdated['password']); // Ocultar campos sensibles

            return $this->respondUpdated([
                'success' => true,
                'message' => "Administrador actualizado correctamente",
                'data'    => $adminUpdated
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
            return $this->fail(['success' => false, 'error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$dni) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'DNI no proporcionado'])
                ->setStatusCode(400);
        }

        $admin = $this->adminModel->getByDNI($dni);

        if (!$admin) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'Administrador no encontrado'])
                ->setStatusCode(404);
        }

        unset($admin['id'], $admin['password']);

        return $this->response->setJSON([
            'success' => true,
            'data' => $admin
        ]) ->setStatusCode(200);
    }

    public function searchAdminById($id)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$this->isSuperAdmin($admin)) {
            return $this->fail(['success' => false, 'error' => 'No tienes permisos para buscar administradores'], 403);
        }

        if (!$id) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'ID no proporcionado'])
                ->setStatusCode(400);
        }

        $admin = $this->adminModel->find($id);

        if (!$admin) {
            return $this->response
                ->setJSON(['success' => false, 'error' => 'Administrador no encontrado'])
                ->setStatusCode(404);
        }

        unset($admin['id'], $admin['password']);

        return $this->response->setJSON([
            'success' => true,
            'data' => $admin
        ]) ->setStatusCode(200);
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

        $email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
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
