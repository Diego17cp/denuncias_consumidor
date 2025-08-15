<?php 

namespace App\Controllers\DenunciasConsumidor\v1;

use App\Models\DenunciasConsumidor\v1\AdjuntoModel;
use CodeIgniter\RESTful\ResourceController;


class AdjuntoController extends ResourceController
{
    protected $modelName = 'App\Models\Denuncia_consumidor\AdjuntoModel';
    protected $format    = 'json';

    /**
     * Subir uno o varios adjuntos para una denuncia
     */
    public function subir($id_denuncia = null)
    {
        if (!$id_denuncia) {
            return $this->failValidationErrors('El ID de la denuncia es obligatorio.');
        }

        $files = $this->request->getFiles();

        if (empty($files['adjuntos'])) {
            return $this->failValidationErrors('No se enviaron archivos.');
        }

        $uploadPath = FCPATH . 'uploads/' . $id_denuncia;
        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $insertados = [];
        foreach ($files['adjuntos'] as $file) {
            if ($file->isValid() && !$file->hasMoved()) {
                $newName  = $file->getRandomName();
                $fileType = $file->getClientMimeType();
                $file->move($uploadPath, $newName);

                $data = [
                    'denuncia_id' => $id_denuncia,
                    'file_path'   => 'uploads/' . $id_denuncia . '/' . $newName,
                    'file_name'   => $file->getClientName(),
                    'file_type'   => $fileType,
                ];

                $this->model->insertAdjunto($data);
                $insertados[] = $data;
            }
        }

        return $this->respondCreated([
            'message' => 'Archivos subidos correctamente',
            'data'    => $insertados
        ]);
    }

    /**
     * Listar adjuntos de una denuncia
     */
    public function listar($id_denuncia = null)
    {
        if (!$id_denuncia) {
            return $this->failValidationErrors('El ID de la denuncia es obligatorio.');
        }

        $adjuntos = $this->model->getByDenunciaId((int)$id_denuncia);

        return $this->respond([
            'message' => 'Lista de adjuntos obtenida correctamente',
            'data'    => $adjuntos
        ]);
    }
}
