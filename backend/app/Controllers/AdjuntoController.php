<?php 
namespace App\Controllers;

use App\Models\AdjuntoModel;
use CodeIgniter\RESTful\ResourceController;

class AdjuntoController extends ResourceController
{
    protected $modelName = 'App\Models\AdjuntoModel';
    protected $format = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Adjunto no encontrado');
        return $this->respond($data);
    }

    public function create()
    {
        $data = $this->request->getPost();
        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Adjunto creado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function update($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Adjunto no encontrado');
        $data = $this->request->getRawInput();
        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Adjunto actualizado']);
        }
        return $this->failValidationErrors($this->model->errors());
    }

    public function delete($id = null)
    {
        if (!$this->model->find($id)) return $this->failNotFound('Adjunto no encontrado');
        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Adjunto eliminado']);
        }
        return $this->failServerError('Error al eliminar adjunto');
    }
}
