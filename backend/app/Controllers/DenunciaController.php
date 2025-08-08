<?php namespace App\Controllers;

use App\Models\DenunciaModel;
use CodeIgniter\RESTful\ResourceController;

class DenunciaController extends ResourceController
{
    protected $modelName = 'App\Models\DenunciaModel';
    protected $format    = 'json';

    // Listar todas las denuncias
    public function index()
    {
        $denuncias = $this->model->findAll();
        return $this->respond($denuncias);
    }

    // Crear una nueva denuncia
    public function create()
    {
        $data = $this->request->getPost();

        // Aquí deberías agregar validaciones!

        if ($this->model->insert($data)) {
            return $this->respondCreated(['message' => 'Denuncia creada']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Ver denuncia por id
    public function show($id = null)
    {
        $denuncia = $this->model->find($id);
        if (!$denuncia) {
            return $this->failNotFound('Denuncia no encontrada');
        }
        return $this->respond($denuncia);
    }

    // Actualizar denuncia por id
    public function update($id = null)
    {
        $data = $this->request->getRawInput();

        if (!$this->model->find($id)) {
            return $this->failNotFound('Denuncia no encontrada');
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Denuncia actualizada']);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Eliminar denuncia por id
    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Denuncia no encontrada');
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Denuncia eliminada']);
        }

        return $this->failServerError('No se pudo eliminar la denuncia');
    }
}
