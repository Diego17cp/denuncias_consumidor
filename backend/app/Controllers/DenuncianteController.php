<?php namespace App\Controllers;

use App\Models\DenuncianteModel;
use CodeIgniter\RESTful\ResourceController;

class DenuncianteController extends ResourceController
{
    protected $modelName = 'App\Models\DenuncianteModel';
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Denunciante no encontrado');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getPost();
        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Denunciante creado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Denunciante no encontrado');
        $data = $this->request->getRawInput();
        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Denunciante actualizado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Denunciante no encontrado');
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Denunciante eliminado']);
        }
        return $this->failServerError('Error al eliminar denunciante');
    }
}
