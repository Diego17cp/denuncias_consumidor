<?php

namespace App\Controllers\User;

use App\Controllers\BaseController;
use App\Models\Denuncia_consumidor\AdjuntoModel;

class AdjuntoController extends BaseController
{
    protected $adjuntoModel;

    public function __construct()
    {
        $this->adjuntoModel = new AdjuntoModel();
    }

    
     // Obtener adjuntos por denuncia
    public function index($denunciaId)
    {
        $adjuntos = $this->adjuntoModel->getByDenunciaId($denunciaId);

        return $this->response->setJSON([
            'status' => 'success',
            'data'   => $adjuntos
        ]);
    }

    
     // Subir adjunto (JSON request)
    public function store()
    {
        $json = $this->request->getJSON(true); 

        if (empty($json)) {
            return $this->response->setJSON([
                'status'  => 'error',
                'message' => 'No se enviaron datos en formato JSON.'
            ])->setStatusCode(400);
        }

        if ($this->adjuntoModel->insertAdjunto($json)) {
            return $this->response->setJSON([
                'status'  => 'success',
                'message' => 'Adjunto subido correctamente',
                'id'      => $this->adjuntoModel->getInsertID()
            ])->setStatusCode(201);
        }

        return $this->response->setJSON([
            'status'  => 'error',
            'message' => $this->adjuntoModel->errors()
        ])->setStatusCode(422);
    }
}
