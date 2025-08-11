<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\Denuncia_consumidor\AdministradorModel;

class AdministradorController extends BaseController
{
    protected $adminModel;

    public function __construct()
    {
        $this->adminModel = new AdministradorModel();
    }

    // Obtener todos los administradores
    public function index()
    {
        $admins = $this->adminModel->findAll();

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $admins
        ]);
    }

    // Obtener un administrador por ID
    public function show($id)
    {
        $admin = $this->adminModel->find($id);
        if (!$admin) {
            return $this->response->setJSON([
                'status'  => 'error',
                'message' => 'Administrador no encontrado'
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $admin
        ]);
    }

    // Crear un nuevo administrador
    public function store()
    {
        $data = $this->request->getJSON(true);

        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if ($this->adminModel->insert($data)) {
            return $this->response->setJSON([
                'status'  => 'success',
                'message' => 'Administrador creado correctamente',
                'id'      => $this->adminModel->getInsertID()
            ])->setStatusCode(201);
        }

        return $this->response->setJSON([
            'status'  => 'error',
            'message' => $this->adminModel->errors()
        ])->setStatusCode(422);
    }

    // Actualizar un administrador
    public function update($id)
    {
        $data = $this->request->getJSON(true);

        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if ($this->adminModel->update($id, $data)) {
            return $this->response->setJSON([
                'status'  => 'success',
                'message' => 'Administrador actualizado correctamente'
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'error',
            'message' => $this->adminModel->errors()
        ])->setStatusCode(422);
    }

    // Eliminar un administrador
    public function delete($id)
    {
        if ($this->adminModel->delete($id)) {
            return $this->response->setJSON([
                'status'  => 'success',
                'message' => 'Administrador eliminado correctamente'
            ]);
        }

        return $this->response->setJSON([
            'status'  => 'error',
            'message' => 'No se pudo eliminar el administrador'
        ])->setStatusCode(400);
    }

    // Login de administrador
    public function login()
    {
        $data = $this->request->getJSON(true);

        if (empty($data['dni']) || empty($data['password'])) {
            return $this->response->setJSON([
                'status'  => 'error',
                'message' => 'DNI y contraseña son requeridos'
            ])->setStatusCode(400);
        }

        $admin = $this->adminModel->verificarLogin($data['dni'], $data['password']);

        if (!$admin) {
            return $this->response->setJSON([
                'status'  => 'error',
                'message' => 'Credenciales incorrectas'
            ])->setStatusCode(401);
        }

        return $this->response->setJSON([
            'status'  => 'success',
            'message' => 'Login correcto',
            'data'    => $admin
        ]);
    }
}
