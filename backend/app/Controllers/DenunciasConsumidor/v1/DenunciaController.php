<?php

namespace App\Controllers\DenunciasConsumidor\v1;

use App\Models\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\DenunciadoModel;
use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use App\Models\DenunciasConsumidor\v1\AdjuntoModel;
use CodeIgniter\RESTful\ResourceController;

class DenunciaController extends ResourceController
{
    protected $denunciasModel;
    protected $denunciantesModel;
    protected $denunciadosModel;
    protected $seguimientoDenunciasModel;
    protected $adjuntoModel;

    protected $format = 'json';

    public function __construct()
    {
        $this->denunciasModel = new DenunciaModel();
        $this->denunciantesModel = new DenuncianteModel();
        $this->denunciadosModel = new DenunciadoModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciaModel();
        $this->adjuntoModel = new AdjuntoModel();
    }

    public function index()
    {
        $denuncias = $this->denunciasModel->findAll();
        return $this->respond($denuncias);
    }

    // CREAR NUEVA DENUNCIA
    public function create()
    {
        $data = $this->request->getPost();
        $files = $this->request->getFiles();
        $result = $this->denunciasModel->createDenuncia($data, $files);
        return $this->respond($result);
    }



    //Consultar seguimientos por código de tracking
    public function query($code)
    {
        $denuncia = $this->denunciasModel->where('tracking_code', $code)->first();

        if (!$denuncia) {
            return $this->respond([
                'success' => false,
                'message' => 'No se encontró la denuncia con el código proporcionado.'
            ]);
        }

        $seguimientos = $this->seguimientoDenunciasModel->where('denuncia_id', $denuncia['id'])->findAll();

        return $this->respond([
            'success' => true,
            'data'    => $seguimientos
        ]);
    }
}
