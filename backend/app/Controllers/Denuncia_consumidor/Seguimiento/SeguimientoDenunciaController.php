<?php namespace App\Controllers\Denuncia_consumidor\Seguimiento;

use App\Models\Denuncia_consumidor\SeguimientoDenunciaModel;
use CodeIgniter\RESTful\ResourceController;

class SeguimientoDenunciaController extends ResourceController
{
    protected $modelName = SeguimientoDenunciaModel::class;
    protected $format    = 'json';

    /**
     * Insertar un nuevo seguimiento
     */
    public function create()
    {
        $data = $this->request->getJSON(true);

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respondCreated([
            'success' => true,
            'message' => 'Seguimiento registrado correctamente'
        ]);
    }

    /**
     * Obtener seguimientos por ID de denuncia
     */
    public function getByDenunciaId($denunciaId = null)
    {
        if (!$denunciaId || !is_numeric($denunciaId)) {
            return $this->failValidationErrors(['denuncia_id' => 'Debe proporcionar un ID válido']);
        }

        $seguimientos = $this->model->obtenerPorDenunciaId((int) $denunciaId);

        if (empty($seguimientos)) {
            return $this->respond([
                'success' => false,
                'message' => 'No se encontraron seguimientos para esta denuncia'
            ]);
        }

        return $this->respond([
            'success' => true,
            'data'    => $seguimientos
        ]);
    }
}
