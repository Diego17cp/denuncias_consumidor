<?php namespace App\Controllers;

use App\Models\AdministradorModel;
use CodeIgniter\RESTful\ResourceController;

class AdministradorController extends ResourceController
{
    protected $modelName = 'App\Models\AdministradorModel';
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Administrador no encontrado');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getPost();
        // TODO: Hashear password aquí antes de insertar
        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Administrador creado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Administrador no encontrado');
        $data = $this->request->getRawInput();
        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Administrador actualizado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Administrador no encontrado');
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Administrador eliminado']);
        }
        return $this->failServerError('Error al eliminar administrador');
    }
}
