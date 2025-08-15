<?php

namespace App\Controllers\DenunciasConsumidor\v1;

use CodeIgniter\RESTful\ResourceController;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use App\Models\DenunciasConsumidor\v1\AdministradorModel;
//use App\Models\DenunciasConsumidor\v1\HistorialAdminModel;
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

        return $decoded->data->dni;

    } catch (\Throwable $e) {
        return $this->respond(['error' => 'Token inválido: ' . $e->getMessage()], 401);
    }
}
    // =========================
    // 📌 Funciones de denuncias
    // =========================

    public function receiveAdmin()
{
    $dni_admin = $this->authAdmin();
    if (!is_string($dni_admin)) {
        // authAdmin ya devuelve la respuesta de error si falla
        return $dni_admin;
    }

    $code       = $this->request->getVar('tracking_code');
    $estado     = 'recibida';
    $comentario = 'La denuncia ha sido recibida por el administrador';

    $seguimientoData = [
        'estado'             => $estado,
        'comentario'         => $comentario,
        'fecha_actualizacion'=> date('Y-m-d H:i:s'),
        'dni'                => $dni_admin
    ];

    $denuncia = $this->denunciaModel->receiveDenuncia(
        $code,
        $dni_admin,
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
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $code       = $this->request->getVar('tracking_code');
        $estado     = $this->request->getVar('estado');
        $comentario = $this->request->getVar('comentario');

        $denuncia = $this->denunciaModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->fail(['message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id'        => $denuncia['id'],
            'estado'             => $estado,
            'comentario'         => $comentario,
            'fecha_actualizacion'=> date('Y-m-d H:i:s'),
            'dni'                => $dni_admin
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

    // public function searchDenuncias()
    // {
    //     $dni_admin = $this->authAdmin();
    //     if (is_object($dni_admin)) return $dni_admin;

    //     $dni = $this->request->getVar('numero_documento');
    //     $denuncias = $this->denunciaModel->searchByDocumento($dni);

    //     if (empty($denuncias)) {
    //         return $this->fail(['message' => 'No se encontraron denuncias']);
    //     }

    //     return $this->respond(['success' => true, 'data' => $denuncias]);
    // }

    public function searchDenuncias()
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $documento = $this->request->getVar('documento');
        $denuncias = $this->denunciaModel->searchByDocumento($documento);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    public function searchDenunciasByDenuncianteId($denuncianteId)
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        if (empty($denuncianteId)) {
            return $this->fail(['message' => 'Falta el parámetro denunciante_id']);
        }

        $denuncias = $this->denunciaModel->searchByDenuncianteId($denuncianteId);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias para este denunciante']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }


    // =========================
    // 👑 Funciones de SuperAdmin
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
        $data = $this->request->getJSON(true);

        if ($this->adminModel->getByDNI($data['dni'])) {
            return $this->response->setJSON(['error' => 'Ya existe un administrador con ese DNI'])->setStatusCode(400);
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        if ($this->adminModel->insert($data)) {
            return $this->response->setJSON(['message' => 'Administrador creado correctamente'])->setStatusCode(201);
        }
        return $this->response->setJSON(['error' => 'Error al crear el administrador'])->setStatusCode(500);
    }

    public function updateAdministrador()
    {
        $data = $this->request->getJSON(true);

        $accion        = $data['accion'] ?? null;
        $dniAdmin      = $data['dni'] ?? null;
        $solicitadoPor = $data['solicitado_por'] ?? null;
        $motivo        = $data['motivo'] ?? null;

        if (!$accion || !$dniAdmin || !$solicitadoPor || !$motivo) {
            return $this->response->setJSON(['error' => 'Faltan parámetros obligatorios'])->setStatusCode(400);
        }

        $admin = $this->adminModel->getByDNI($dniAdmin);
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }

        switch ($accion) {
            case 'estado':
                $estado = $data['estado'] ?? null;
                if (!in_array($estado, ['activo', 'inactivo'])) {
                    return $this->response->setJSON(['error' => 'Estado inválido'])->setStatusCode(400);
                }
                $this->adminModel->where('dni', $dniAdmin)->set(['estado' => $estado])->update();
                break;

            case 'rol':
                $rol = $data['rol'] ?? null;
                if (!$rol) {
                    return $this->response->setJSON(['error' => 'Falta el rol'])->setStatusCode(400);
                }
                $this->adminModel->where('dni', $dniAdmin)->set(['rol' => $rol])->update();
                break;

            case 'password':
                $password = $data['password'] ?? null;
                if (!$password) {
                    return $this->response->setJSON(['error' => 'Falta la contraseña'])->setStatusCode(400);
                }
                $this->adminModel->where('dni', $dniAdmin)->set(['password' => password_hash($password, PASSWORD_DEFAULT)])->update();
                break;

            default:
                return $this->response->setJSON(['error' => 'Acción no válida'])->setStatusCode(400);
        }

        $this->historialModel->registrarAccion($solicitadoPor, $dniAdmin, $accion, $motivo);

        return $this->response->setJSON(['message' => 'Administrador actualizado correctamente']);
    }

    public function searchAdmin()
    {
        $dni = $this->request->getGet('dni');
        if (!$dni) {
            return $this->response->setJSON(['error' => 'DNI no proporcionado'])->setStatusCode(400);
        }

        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->response->setJSON(['error' => 'Administrador no encontrado'])->setStatusCode(404);
        }
        return $this->response->setJSON($admin);
    }

    // public function historyAdmin()
    // {
    //     $history = $this->historialModel->obtenerHistorialCompleto();
    //     if (!$history) {
    //         return $this->response->setJSON(['error' => 'No se encontraron registros de historial'])->setStatusCode(404);
    //     }
    //     return $this->response->setJSON($history);
    // }

    // =========================
    // 📧 Función auxiliar
    // =========================
    private function enviarCorreo($correo, $code, $estado, $comentario)
    {
        $this->email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $this->email->setTo($correo);
        $this->email->setSubject('Código de Seguimiento de Denuncia');
        $this->email->setMessage("
            <html><body>
            <p>Estimado usuario,</p>
            <p>Estado actual de su denuncia:</p>
            <p><strong>Código:</strong> $code</p>
            <p><strong>Estado:</strong> $estado</p>
            <p><strong>Comentario:</strong> $comentario</p>
            <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Ver seguimiento</a></p>
            </body></html>
        ");
        return $this->email->send();
    }
}
