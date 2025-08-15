<?php 

namespace App\Controllers\DenunciasConsumidor\v1;

use App\Models\DenunciasConsumidor\v1\DenunciadoModel;
use CodeIgniter\RESTful\ResourceController;

class DenunciadoController extends ResourceController
{
    protected $modelName = DenunciadoModel::class;
    protected $format    = 'json';

    // Listar todos los denunciados
    public function index()
    {
        return $this->respond($this->model->findAll(), 200);
    }

    // Mostrar un denunciado por ID
    public function show($id = null)
    {
        $denunciado = $this->model->find($id);
        if (!$denunciado) {
            return $this->failNotFound('Denunciado no encontrado');
        }
        return $this->respond($denunciado, 200);
    }

    // Crear denunciado (POST JSON)
    public function create()
    {
        $input = $this->request->getJSON(true);

        $denunciadoData = [
            'nombre'         => $input['nombre'] ?? null,
            'tipo_documento' => $input['tipo_documento'] ?? null,
            'direccion'      => $input['direccion'] ?? null,
            'telefono'       => $input['telefono'] ?? null
        ];

        if ($this->model->insert($denunciadoData)) {
            return $this->respondCreated([
                'status'  => 'success',
                'message' => 'Denunciado registrado correctamente',
                'id'      => $this->model->getInsertID()
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Actualizar denunciado existente
    public function update($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Denunciado no encontrado');
        }

        $data = $this->request->getJSON(true);

        if ($this->model->update($id, $data)) {
            return $this->respond([
                'status'  => 'success',
                'message' => 'Denunciado actualizado correctamente'
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Eliminar denunciado
    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Denunciado no encontrado');
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'status'  => 'success',
                'message' => 'Denunciado eliminado correctamente'
            ]);
        }

        return $this->failServerError('Error al eliminar denunciado');
    }
}
