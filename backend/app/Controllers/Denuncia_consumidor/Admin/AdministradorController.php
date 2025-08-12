<?php

namespace App\Controllers\Denuncia_consumidor\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\Denuncia_consumidor\DenuncianteModel;
use App\Models\Denuncia_consumidor\DenunciaModel;
use App\Models\Denuncia_consumidor\SeguimientoDenunciaModel;
use App\Models\Denuncia_consumidor\AdministradorModel;
use CodeIgniter\Config\Services;

class AdministradorController extends ResourceController
{
    private $denunciantesModel;
    private $denunciasModel;
    private $seguimientoDenunciaModel;
    private $administradorModel;
    private $email;

    public function __construct()
    {
        $this->denunciantesModel       = new DenuncianteModel();
        $this->denunciasModel          = new DenunciaModel();
        $this->seguimientoDenunciaModel= new SeguimientoDenunciaModel();
        $this->administradorModel      = new AdministradorModel();
        $this->email                   = Services::email();
    }

    private function enviarCorreo($correo, $code, $estado, $comentario)
    {
        $this->email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $this->email->setTo($correo);
        $this->email->setSubject('Estado de su Denuncia');
        $this->email->setMessage("
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <p>Estimado usuario,</p>
                <p>Su denuncia ha sido actualizada:</p>
                <p><strong>Código:</strong> $code</p>
                <p><strong>Estado:</strong> $estado</p>
                <p><strong>Comentario:</strong> $comentario</p>
                <p>Puede hacer seguimiento aquí: 
                    <a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Seguimiento</a>
                </p>
                <p>Atentamente,<br>Municipalidad Distrital de José Leonardo Ortiz</p>
            </body>
            </html>
        ");
        return $this->email->send();
    }

    public function receiveAdmin()
    {
        $code      = $this->request->getGet('tracking_code');
        $dni_admin = $this->request->getGet('dni_admin');

        $admin = $this->administradorModel->getByDNI($dni_admin);
        if (!$admin) {
            return $this->response->setJSON(['success' => false, 'message' => 'Administrador no encontrado']);
        }

        $denuncia = $this->denunciasModel->where('tracking_code', $code)->first();
        if (!$denuncia) {
            return $this->response->setJSON(['success' => false, 'message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id'      => $denuncia['id'],
            'estado'           => 'recibida',
            'comentario'       => 'La denuncia ha sido recibida por el administrador',
            'administrador_id' => $admin['id']
        ]);

        $this->denunciasModel->update($denuncia['id'], ['estado' => 'recibida']);

        $denunciante = $this->denunciantesModel->find($denuncia['denunciante_id']);
        if ($denunciante && !empty($denunciante['email'])) {
            $this->enviarCorreo($denunciante['email'], $code, 'recibida', 'La denuncia ha sido recibida por el administrador');
        }

        return $this->response->setJSON(['success' => true, 'message' => 'Denuncia recibida correctamente']);
    }

    public function procesosDenuncia()
    {
        $code        = $this->request->getGet('tracking_code');
        $dni_admin   = $this->request->getGet('dni_admin');
        $estado      = $this->request->getGet('estado');
        $comentario  = $this->request->getGet('comentario');

        $admin = $this->administradorModel->getByDNI($dni_admin);
        if (!$admin) {
            return $this->response->setJSON(['success' => false, 'message' => 'Administrador no encontrado']);
        }

        $denuncia = $this->denunciasModel->where('tracking_code', $code)->first();
        if (!$denuncia) {
            return $this->response->setJSON(['success' => false, 'message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id'      => $denuncia['id'],
            'estado'           => $estado,
            'comentario'       => $comentario,
            'administrador_id' => $admin['id']
        ]);

        $this->denunciasModel->update($denuncia['id'], ['estado' => $estado]);

        $denunciante = $this->denunciantesModel->find($denuncia['denunciante_id']);
        if ($denunciante && !empty($denunciante['email'])) {
            $this->enviarCorreo($denunciante['email'], $code, $estado, $comentario);
        }

        return $this->response->setJSON(['success' => true, 'message' => 'Denuncia actualizada correctamente']);
    }
}
