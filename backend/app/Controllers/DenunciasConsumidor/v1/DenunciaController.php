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

    
    // public function create()
    // {
    //     $input = $this->request->getJSON(true);

    //     // Generar tracking code único
    //     $code = $this->generateTrackingCode();

    //     // Evitar registrar una denuncia con el mismo tracking code
    //     if ($this->denunciasModel->where('tracking_code', $code)->first()) {
    //         return $this->respond([
    //             'success' => false,
    //             'message' => 'Denuncia ya registrada previamente',
    //             'tracking_code' => $code
    //         ]);
    //     }

    //     // Construir los datos para insertar
    //     $denunciaData = [
    //         'tracking_code'   => $code,
    //         'es_anonimo'      => $input['es_anonimo'] ?? 0,
    //         'denunciante_id'  => $input['denunciante_id'] ?? null,
    //         'descripcion'     => $input['descripcion'] ?? null,
    //         'fecha_incidente' => $input['fecha_incidente'] ?? null,
    //         'denunciado_id'   => $input['denunciado_id'] ?? null,
    //         'fecha_registro'  => date('Y-m-d H:i:s'),
    //         'estado'          => 'registrado',
    //     ];

    //     if ($this->denunciasModel->insert($denunciaData)) {
    //         // Enviar correo si no es anónima
    //         if (!$denunciaData['es_anonimo'] && !empty($denunciaData['denunciante_id'])) {
    //             $denunciante = $this->denunciantesModel->find($denunciaData['denunciante_id']);
    //             if ($denunciante && isset($denunciante['email'])) {
    //                 $this->enviarCorreoTracking($denunciante['email'], $code);
    //             }
    //         }

    //         return $this->respondCreated([
    //             'success'       => true,
    //             'message'       => 'Denuncia registrada correctamente',
    //             'tracking_code' => $code
    //         ]);
    //     }

    //     return $this->failValidationErrors($this->denunciasModel->errors());
    // }


    public function create()
    {
        $input = $this->request->getPost(); // 📌 form-data (para manejar adjuntos)

        $db = \Config\Database::connect();
        $db->transBegin(); // Iniciamos transacción

        try {
            // 📌 1. Insertar Denunciado
            $denunciadoId = null;
            if (!empty($input['d1nombre'])) {
                $this->denunciadosModel->insert([
                    'nombre'         => $input['d1nombre'],
                    'tipo_documento' => $input['d1tipo_documento'] ?? null,
                    'documento'      => $input['d1documento'] ?? null,
                    'direccion'      => $input['d1direccion'] ?? null,
                    'telefono'       => $input['d1telefono'] ?? null
                ]);

                $denunciadoId = $this->denunciadosModel->getInsertID();
            }

            // 📌 2. Insertar Denunciante (si no es anónimo)
            $denuncianteId = null;
            if ((int)($input['es_anonimo'] ?? 0) === 0) {
                if (!empty($input['documento'])) {
                    $denunciante = $this->denunciantesModel
                        ->where('documento', $input['documento'])
                        ->first();

                    if ($denunciante) {
                        $denuncianteId = $denunciante['id'];
                    } else {
                        $this->denunciantesModel->insert([
                            'nombre'        => $input['d2nombre'] ?? null,
                            'email'         => $input['d2email'] ?? null,
                            'telefono'      => $input['d2telefono'] ?? null,
                            'celular'       => $input['d2celular'] ?? null,
                            'documento'     => $input['d2documento'] ?? null,
                            'tipo_documento'=> $input['d2tipo_documento'] ?? null,
                            'razon_social'  => $input['d2razon_social'] ?? null,
                            'sexo'          => $input['d2sexo'] ?? null,
                            'distrito'      => $input['d2distrito'] ?? null,
                            'provincia'     => $input['d2provincia'] ?? null,
                            'departamento'  => $input['d2departamento'] ?? null,
                            'direccion'     => $input['d2direccion'] ?? null  
                        ]);

                        $denuncianteId = $this->denunciantesModel->getInsertID();
                    }
                }
            }

            // 📌 3. Insertar Denuncia con IDs
            $tracking = $this->generateTrackingCode();
            $denunciaId = $this->denunciasModel->insert([
                'tracking_code'   => $tracking,
                'es_anonimo'      => $input['es_anonimo'] ?? 0,
                'denunciante_id'  => $denuncianteId,
                'denunciado_id'   => $denunciadoId,
                'descripcion'     => $input['descripcion'] ?? null,
                'fecha_incidente' => $input['fecha_incidente'] ?? null,
                'estado'          => 'registrado'
            ], true);

            //$denunciaId = $this->denunciasModel->getInsertID();

            if (!$denunciaId) {
                log_message('error', 'Errores de validación: ' . json_encode($this->denunciasModel->errors()));
                throw new \Exception("Error en validación");
            }

            // 📌 4. Guardar adjuntos (si los hay)
            $files = $this->request->getFiles();
            if (isset($files['adjuntos'])) {
                $uploadPath = FCPATH . 'denuncias/' . $denunciaId;
                if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);

                foreach ($files['adjuntos'] as $file) {
                    if ($file->isValid() && !$file->hasMoved()) {
                        if (!in_array($file->getClientMimeType(), ['image/jpeg','image/png','application/pdf'])) {
                            throw new \Exception("Tipo de archivo no permitido");
                        }
                        $newName = $file->getRandomName();
                        $file->move($uploadPath, $newName);

                        $this->adjuntoModel->insert([
                            'denuncia_id' => $denunciaId,
                            'file_path'   => 'denuncias/' . $denunciaId . '/' . $newName
                        ]);
                    }
                }
            }

            // 📌 5. Insertar Seguimiento inicial
            $this->seguimientoDenunciasModel->insert([
                'denuncia_id' => $denunciaId,
                'comentario'     => 'Denuncia registrada en el sistema',
            ]);

            // 📌 6. Enviar correo al denunciante (si aplica)
            if (!empty($denuncianteId)) {
                $denunciante = $this->denunciantesModel->find($denuncianteId);
                if ($denunciante && !empty($denunciante['email'])) {
                    $this->enviarCorreoTracking($denunciante['email'], $tracking);
                }
            }

            $db->transCommit();

            // 📌 7. Respuesta final
            return $this->respondCreated([
                'success'       => true,
                'message'       => 'Denuncia registrada con éxito',
                'tracking_code' => $tracking,
                'denuncia_id'   => $denunciaId
            ]);

        } catch (\Exception $e) {
            $db->transRollback();
            return $this->failServerError("Error al registrar la denuncia: " . $e->getMessage());
        }
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
    public function enviarCorreoTracking($correo, $code)
    {
        // Cargar la librería Email de CI4
        $emailService = \Config\Services::email();

        // Configuración del remitente y destinatario
        $emailService->setFrom('anaga123op@gmail.com', 'AÑA');
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
