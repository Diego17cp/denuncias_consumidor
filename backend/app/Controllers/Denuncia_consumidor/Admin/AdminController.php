<?php

namespace App\Controllers\Denuncias_consumidor\Admin;

use CodeIgniter\RESTful\ResourceController;
use App\Models\Denuncia_consumidor\DenuncianteModel;
use App\Models\Denuncia_consumidor\DenunciaModel;
use App\Models\Denuncia_consumidor\SeguimientoDenunciaModel;
use App\Controllers\Denuncia_consumidor\VerificarAdmi;
use CodeIgniter\Config\Services;

class AdminController extends ResourceController
{
    private $denuncianteModel;
    private $denunciaModel;
    private $seguimientoDenunciaModel;
    private $email;
    private $verificarAdmi;

    public function __construct()
    {
        $this->denuncianteModel = new DenuncianteModel();
        $this->denunciaModel = new DenunciaModel();
        $this->seguimientoDenunciaModel = new SeguimientoDenunciaModel();
        $this->email = Services::email();
        $this->verificarAdmi = new VerificarAdmi();
    }

    private function authAdmin()
    {
        $dni_admin = $this->request->getVar('dni');
        if (!$this->verificarAdmi->validar($dni_admin)) {
            return $this->fail(['message' => 'Acceso denegado: administrador no válido'], 403);
        }
        return $dni_admin;
    }

    public function dashboard()
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $denuncias = $this->denunciaModel->getDashboardData();
        return $this->respond($denuncias);
    }

    public function receiveAdmin()
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $code = $this->request->getVar('tracking_code');
        $estado = 'recibida';
        $comentario = 'La denuncia ha sido recibida por el administrador';

        $denuncia = $this->denunciaModel->receiveDenuncia(
            $code,
            $dni_admin,
            $estado,
            $comentario,
            [
                'denuncia_id' => null,
                'estado' => $estado,
                'comentario' => $comentario,
                'fecha_actualizacion' => date('Y-m-d H:i:s'),
                'dni_admin' => $dni_admin
            ]
        );

        if (!$denuncia) {
            return $this->fail(['message' => 'Error al recibir la denuncia']);
        }

        $correo = $this->denuncianteModel
            ->select('email')
            ->where('id', $denuncia['denunciante_id'])
            ->first();

        if ($correo) {
            $this->enviarCorreo($correo['email'], $code, $estado, $comentario);
        }

        return $this->respond(['success' => true, 'message' => 'La denuncia fue recibida']);
    }

    public function procesosDenuncia()
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $code = $this->request->getVar('tracking_code');
        $estado = $this->request->getVar('estado');
        $comentario = $this->request->getVar('comentario');

        $denuncia = $this->denunciaModel
            ->where('tracking_code', $code)
            ->first();

        if (!$denuncia) {
            return $this->fail(['message' => 'Denuncia no encontrada']);
        }

        $this->seguimientoDenunciaModel->insert([
            'denuncia_id' => $denuncia['id'],
            'estado' => $estado,
            'comentario' => $comentario,
            'fecha_actualizacion' => date('Y-m-d H:i:s'),
            'dni_admin' => $dni_admin
        ]);

        $this->denunciaModel
            ->where('tracking_code', $code)
            ->set(['estado' => $estado])
            ->update();

        $correo = $this->denuncianteModel
            ->select('email')
            ->where('id', $denuncia['denunciante_id'])
            ->first();

        if ($correo) {
            $this->enviarCorreo($correo['email'], $code, $estado, $comentario);
        }

        return $this->respond(['success' => true, 'message' => 'Denuncia actualizada']);
    }

    public function search()
    {
        $dni_admin = $this->authAdmin();
        if (is_object($dni_admin)) return $dni_admin;

        $dni = $this->request->getVar('numero_documento');
        $denuncias = $this->denunciaModel->searchByDocumento($dni);

        if (empty($denuncias)) {
            return $this->fail(['message' => 'No se encontraron denuncias']);
        }

        return $this->respond(['success' => true, 'data' => $denuncias]);
    }

    private function enviarCorreo($correo, $code, $estado, $comentario)
    {
        $this->email->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $this->email->setTo($correo);
        $this->email->setSubject('Código de Seguimiento de Denuncia');
        $this->email->setMessage("
            <html><body>
            <p>Estimado usuario,</p>
            <p>Estado actual de su denuncia:</p>
            <p><strong>Código:</strong> $code</p>
            <p><strong>Estado:</strong> $estado</p>
            <p><strong>Comentario:</strong> $comentario</p>
            <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Ver seguimiento</a></p>
            </body></html>
        ");
        return $this->email->send();
    }
}
