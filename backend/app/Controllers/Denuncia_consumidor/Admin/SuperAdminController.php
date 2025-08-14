<?php

namespace App\Controllers\Denuncias_consumidor\Admin;

use App\Controllers\BaseController;
use App\Models\Denuncia_consumidor\AdministradorModel;
use App\Models\Denuncia_consumidor\HistorialAdminModel;

class SuperAdminController extends BaseController
{
    private $adminModel;
    private $historialModel;

    public function __construct()
    {
        $this->adminModel     = new AdministradorModel();
        $this->historialModel = new HistorialAdminModel();
    }

    /**
     * Listar todos los administradores
     */
    public function getAdministradores()
    {
        $admins = $this->adminModel->findAll();
        if (!$admins) {
            return $this->response->setJSON(['error' => 'No se encontraron administradores'])->setStatusCode(404);
        }
        return $this->response->setJSON($admins);
    }

    /**
     * Crear nuevo administrador
     */
    public function createAdministrador()
    {
        $data = $this->request->getJSON(true);

        // Verificar si ya existe por DNI
        if ($this->adminModel->getByDNI($data['dni'])) {
            return $this->response->setJSON(['error' => 'Ya existe un administrador con ese DNI'])->setStatusCode(400);
        }

        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

        if ($this->adminModel->insert($data)) {
            return $this->response->setJSON(['message' => 'Administrador creado correctamente'])->setStatusCode(201);
        }
        return $this->response->setJSON(['error' => 'Error al crear el administrador'])->setStatusCode(500);
    }

    /**
     * Actualizar estado, rol o contraseña
     */
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

        // Registrar en historial
        $this->historialModel->registrarAccion($solicitadoPor, $dniAdmin, $accion, $motivo);

        return $this->response->setJSON(['message' => 'Administrador actualizado correctamente']);
    }

    /**
     * Buscar administrador por DNI
     */
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

    /**
     * Historial de acciones
     */
    public function historyAdmin()
    {
        $history = $this->historialModel->obtenerHistorialCompleto();
        if (!$history) {
            return $this->response->setJSON(['error' => 'No se encontraron registros de historial'])->setStatusCode(404);
        }
        return $this->response->setJSON($history);
    }
}
