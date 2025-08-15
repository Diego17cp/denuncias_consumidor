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
        $input = $this->request->getJSON(true);
        if (!$input) {
            $input = $this->request->getPost();
        }

        // Mapear explícitamente a los campos permitidos
        $seguimientoData = [
            'denuncia_id'     => $input['denuncia_id'] ?? null,
            'estado'          => $input['estado'] ?? null,
            'comentario'      => $input['comentario'] ?? null,
            'administrador_id'=> $input['administrador_id'] ?? null
        ];

        // Log para depuración
        log_message('debug', 'Datos procesados: ' . json_encode($seguimientoData));

        if ($this->model->insert($seguimientoData)) {
            return $this->respondCreated([
                'success' => true,
                'message' => 'Seguimiento registrado correctamente',
                'id'      => $this->model->getInsertID()
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
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
