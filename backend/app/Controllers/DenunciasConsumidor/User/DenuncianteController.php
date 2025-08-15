<?php namespace App\Controllers\Denuncia_consumidor\User;

use App\Models\Denuncia_consumidor\DenuncianteModel;
use CodeIgniter\RESTful\ResourceController;

class DenuncianteController extends ResourceController
{
    protected $modelName = 'App\Models\Denuncia_consumidor\DenuncianteModel';
    protected $format    = 'json';

    // Listar todos los denunciantes
    public function index()
    {
        return $this->respond($this->model->findAll(), 200);
    }

    // Mostrar un denunciante por ID    
    public function show($id = null)
    {
        $denunciante = $this->model->find($id);
        if (!$denunciante) {
            return $this->failNotFound('Denunciante no encontrado');
        }
        return $this->respond($denunciante, 200);
    }

    // Crear un nuevo denunciante (POST JSON)
    public function create()
{
    $input = $this->request->getJSON(true); // Obtener datos como array

    $denuncianteData = [
        'nombre'           => $input['nombre'] ?? null,
        'email'            => $input['email'] ?? null,
        'telefono'         => $input['telefono'] ?? null,
        'numero_documento' => $input['numero_documento'] ?? null,
        'tipo_documento'   => $input['tipo_documento'] ?? null,
        'razon_social'     => $input['razon_social'] ?? null,
        'sexo'             => $input['sexo'] ?? null,
        'distrito'         => $input['distrito'] ?? null,
        'provincia'        => $input['provincia'] ?? null,
        'departamento'     => $input['departamento'] ?? null,
        'direccion'        => $input['direccion'] ?? null
    ];

    if ($this->model->insert($denuncianteData)) {
        return $this->respondCreated([
            'message' => 'Denunciante registrado correctamente',
            'id'      => $this->model->getInsertID()
        ]);
    }

    return $this->failValidationErrors($this->model->errors());
}

    // Actualizar un denunciante existente
    public function update($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Denunciante no encontrado');
        }

        $data = $this->request->getJSON(true);

        if ($this->model->update($id, $data)) {
            return $this->respond([
                'message' => 'Denunciante actualizado correctamente'
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    // Eliminar un denunciante
    public function delete($id = null)
    {
        if (!$this->model->find($id)) {
            return $this->failNotFound('Denunciante no encontrado');
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'message' => 'Denunciante eliminado correctamente'
            ]);
        }

        return $this->failServerError('Error al eliminar denunciante');
    }
}
