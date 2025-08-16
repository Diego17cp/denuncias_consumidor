<?php 

namespace App\Controllers\DenunciasConsumidor\v1;

use App\Models\DenunciasConsumidor\v1\DenunciaModel;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\DenunciadoModel;
use App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel;
use CodeIgniter\RESTful\ResourceController;

class DenunciaController extends ResourceController
{
    protected $denunciasModel;
    protected $denunciantesModel;
    protected $denunciadosModel;
    protected $seguimientoDenunciasModel;

    protected $format = 'json';

    public function __construct()
    {
        $this->denunciasModel = new DenunciaModel();
        $this->denunciantesModel = new DenuncianteModel();
        $this->denunciadosModel = new DenunciadoModel();
        $this->seguimientoDenunciasModel = new SeguimientoDenunciaModel();
    }

    /**
     * Genera un código de seguimiento único
     */
    private function generateTrackingCode()
    {
        do {
            $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(4))); // 8 caracteres hexadecimales
        } while ($this->denunciasModel->where('tracking_code', $trackingCode)->first());

        return $trackingCode;
    }

        public function index()
    {
        $denuncias = $this->denunciasModel->findAll();
        return $this->respond($denuncias);
    }

    /**
     * Crear una nueva denuncia
     */
    public function create()
    {
        $input = $this->request->getJSON(true);

        // Generar tracking code único
        $code = $this->generateTrackingCode();

        // Evitar registrar una denuncia con el mismo tracking code
        if ($this->denunciasModel->where('tracking_code', $code)->first()) {
            return $this->respond([
                'success' => false,
                'message' => 'Denuncia ya registrada previamente',
                'tracking_code' => $code
            ]);
        }

        // Construir los datos para insertar
        $denunciaData = [
            'tracking_code'   => $code,
            'es_anonimo'      => $input['es_anonimo'] ?? 0,
            'denunciante_id'  => $input['denunciante_id'] ?? null,
            'motivo_otro'     => $input['motivo_otro'] ?? null,
            'descripcion'     => $input['descripcion'] ?? null,
            'fecha_incidente' => $input['fecha_incidente'] ?? null,
            'denunciado_id'   => $input['denunciado_id'] ?? null,
            'fecha_registro'  => date('Y-m-d H:i:s'),
            'estado'          => 'registrado',
            //'pdf_path'        => $input['pdf_path'] ?? null
        ];

        if ($this->denunciasModel->insert($denunciaData)) {
            // Enviar correo si no es anónima
            if (!$denunciaData['es_anonimo'] && !empty($denunciaData['denunciante_id'])) {
                $denunciante = $this->denunciantesModel->find($denunciaData['denunciante_id']);
                if ($denunciante && isset($denunciante['email'])) {
                    $this->enviarCorreoTracking($denunciante['email'], $code);
                }
            }

            return $this->respondCreated([
                'success'       => true,
                'message'       => 'Denuncia registrada correctamente',
                'tracking_code' => $code
            ]);
        }

        return $this->failValidationErrors($this->denunciasModel->errors());
    }

    /**
     * Consultar seguimientos por código de tracking
     */
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

    /**
     * Simulación de envío de correo (aquí iría tu lógica real con email)
     */
    public function correo($correo, $code)
    {
        // Cargar la librería Email de CI4
        $emailService = \Config\Services::email();

        // Configuración del remitente y destinatario
        $emailService->setFrom('munijloenlinea@gmail.com', 'Municipalidad Distrital de José Leonardo Ortiz');
        $emailService->setTo($correo);
        $emailService->setSubject('Código de Seguimiento de Denuncia');

        // Mensaje en HTML con tu formato
        $mensaje = "
            <html>
            <head>
                <title>Código de Seguimiento de Denuncia</title>
            </head>
            <body style='font-family: Asap, sans-serif;'>
                <p>Estimado usuario,</p>
                <p>Su denuncia ha sido registrada exitosamente. A continuación, le proporcionamos su código de seguimiento:</p>
                <p style='font-size: 18px; font-weight: bold; color: #2E8ACB; padding:15px; background-color: #CDDFEC;'>$code</p>
                <p>Por favor, conserve este código para futuras consultas.</p>
                <p>Para realizar el seguimiento de su denuncia, puede ingresar al siguiente enlace:</p>
                <p><a href='http://localhost:5173/tracking-denuncia?codigo=$code'>Seguimiento</a></p>
                <p>Atentamente,</p>
                <p><strong>Municipalidad Distrital de José Leonardo Ortiz</strong></p>
            </body>
            </html>
        ";

        $emailService->setMessage($mensaje);

        // Enviar correo y devolver resultado
        if ($emailService->send()) {
            log_message('info', "Correo enviado correctamente a {$correo}");
            return true;
        } else {
            log_message('error', "Error al enviar correo: " . $emailService->printDebugger(['headers']));
            return false;
        }
    }

}
