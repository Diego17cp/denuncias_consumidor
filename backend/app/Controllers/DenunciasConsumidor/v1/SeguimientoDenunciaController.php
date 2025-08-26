<?php 

namespace App\Controllers\DenunciasConsumidor\v1;

use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
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

        // Mapear los campos
        $seguimientoData = [
            'denuncia_id'      => $input['denuncia_id'] ?? null,
            'comentario'       => $input['comentario'] ?? '',
            'administrador_id' => $input['administrador_id'] ?? null,
            'estado'           => $input['estado'] ?? null 
        ];

        if ($this->model->insert($seguimientoData)) {
            return $this->respondCreated([
                'success' => true,
                'message' => 'Seguimiento registrado correctamente',
                'data'    => [
                    'id'          => $this->model->getInsertID(),
                    'denuncia_id' => $seguimientoData['denuncia_id'],
                    'estado'      => $seguimientoData['estado']
                ]
            ]);
        }

        return $this->failValidationErrors($this->model->errors());
    }

    /**
     * Obtener seguimientos por ID de denuncia
     */
    public function getByDenunciaId($denunciaId)
    {
        if (!$denunciaId || !is_numeric($denunciaId)) {
            return $this->respond([
                'success' => false,
                'message' => 'Debe proporcionar un ID válido',
                'data'    => null
            ], 400);
        }

        // Obtenemos los seguimientos incluyendo el estado
        $seguimientos = $this->model
            ->select('id, denuncia_id, comentario, estado, created_at')
            ->where('denuncia_id', $denunciaId)
            ->orderBy('created_at', 'DESC')
            ->findAll();

        if (empty($seguimientos)) {
            return $this->respond([
                'success' => false,
                'message' => 'No se encontraron seguimientos para esta denuncia',
                'data'    => []
            ]);
        }

        return $this->respond([
            'success' => true,
            'message' => 'Seguimientos obtenidos correctamente',
            'data'    => $seguimientos
        ]);
    }

}
