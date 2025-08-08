<?php namespace App\Controllers;

use App\Models\SeguimientoDenunciaModel;
use CodeIgniter\RESTful\ResourceController;

class SeguimientoDenunciaController extends ResourceController
{
    protected $modelName = 'App\Models\SeguimientoDenunciaModel';
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Seguimiento no encontrado');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getPost();  // debería funcionar bien
        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Seguimiento creado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Seguimiento no encontrado');
        $data = $this->request->getRawInput();
        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Seguimiento actualizado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Seguimiento no encontrado');
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Seguimiento eliminado']);
        }
        return $this->failServerError('Error al eliminar seguimiento');
    }
}
