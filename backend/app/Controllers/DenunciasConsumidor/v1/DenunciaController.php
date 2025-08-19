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

    // CREAR NUEVA DENUNCIA
    // public function create()
    // {
    //     $input = $this->request->getPost(); 

    //     $db = \Config\Database::connect();
    //     $db->transBegin(); 

    //     try {
            
    //         $denunciadoId = null;
    //         if (!empty($input['d1nombre'])) {

    //             $denunciado = $this->denunciadosModel
    //                 ->where('documento', $input['d1documento'])
    //                 ->first();

    //             if($denunciado){
    //                 $denunciadoId = $denunciado['id'];
    //             } else {
    //                 $this->denunciadosModel->insert([
    //                     'nombre'         => $input['d1nombre'],
    //                     'tipo_documento' => $input['d1tipo_documento'] ?? null,
    //                     'documento'      => $input['d1documento'] ?? null,
    //                     'direccion'      => $input['d1direccion'] ?? null,
    //                     'telefono'       => $input['d1telefono'] ?? null
    //                 ]);

    //                 $denunciadoId = $this->denunciadosModel->getInsertID();
    //             }                   
    //         }

    //         $denuncianteId = null;
    //         if ((int)($input['es_anonimo'] ?? 0) === 1) {
    //             $denuncianteId = null;
    //         } else {
                
    //             if (!empty($input['documento'])) {
    //                 $denunciante = $this->denunciantesModel
    //                     ->where('documento', $input['documento'])
    //                     ->first();

    //                 if ($denunciante) {
    //                     $denuncianteId = $denunciante['id'];
    //                 } else {
    //                     $this->denunciantesModel->insert([
    //                         'nombre'        => $input['nombre'] ?? null,
    //                         'email'         => $input['email'] ?? null,
    //                         'telefono'      => $input['telefono'] ?? null,
    //                         'celular'       => $input['celular'] ?? null,
    //                         'documento'     => $input['documento'] ?? null,
    //                         'tipo_documento'=> $input['tipo_documento'] ?? null,
    //                         'razon_social'  => $input['razon_social'] ?? null,
    //                         'sexo'          => $input['sexo'] ?? null,
    //                         'distrito'      => $input['distrito'] ?? null,
    //                         'provincia'     => $input['provincia'] ?? null,
    //                         'departamento'  => $input['departamento'] ?? null,
    //                         'direccion'     => $input['direccion'] ?? null, 
    //                         //'lugar'          => $input['lugar'] ?? null
    //                     ], true);

                        

    //                     $denuncianteId = $this->denunciantesModel->getInsertID();
    //                 }
    //             }
    //         }

            
    //         $tracking = $this->generateTrackingCode();
    //         $denunciaId = $this->denunciasModel->insert([
    //             'tracking_code'   => $tracking,
    //             'es_anonimo'      => $input['es_anonimo'] ?? 0,
    //             'denunciante_id'  => $denuncianteId,
    //             'denunciado_id'   => $denunciadoId,
    //             'descripcion'     => $input['descripcion'] ?? null,
    //             'fecha_incidente' => $input['fecha_incidente'] ?? null,
    //             'estado'          => 'registrado'
    //         ], true);

    //         if (!$denunciaId) {
    //             log_message('error', 'Errores de validación: ' . json_encode($this->denunciasModel->errors()));
    //             throw new \Exception("Error en validación");
    //         }

    //         $files = $this->request->getFiles();

    //         if (isset($files['adjuntos'])) {
    //             // Validar máximo 10 archivos
    //             if (count($files['adjuntos']) > 10) {
    //                 throw new \Exception("No se permiten más de 10 archivos adjuntos");
    //             }

    //             $uploadPath = FCPATH . 'denuncias/' . $denunciaId;
    //             if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);

                
    //             $allowedTypes = [
                    
    //                 'image/jpeg', 'image/png', 'image/webp', 'image/avif',
                    
    //                 'application/pdf',
    //                 'application/msword', 
    //                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    //                 'text/plain',
                    
    //                 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/x-m4a',
                    
    //                 'video/mp4', 'video/x-msvideo', 'video/avi', 'video/mpeg', 'video/ogg', 'video/webm',
    //                 'application/zip', 'application/x-zip-compressed'
    //             ];

    //             foreach ($files['adjuntos'] as $file) {
    //                 if ($file->isValid() && !$file->hasMoved()) {

    //                     // Validar tamaño máximo 20MB
    //                     if ($file->getSize() > 20 * 1024 * 1024) {
    //                         throw new \Exception("El archivo {$file->getClientName()} excede el límite de 20MB");
    //                     }

    //                     // Validar tipo de archivo
    //                     if (!in_array($file->getClientMimeType(), $allowedTypes)) {
    //                         throw new \Exception("Tipo de archivo no permitido: {$file->getClientMimeType()}");
    //                     }

    //                     $newName = $file->getRandomName();
    //                     $file->move($uploadPath, $newName);

    //                     $this->adjuntoModel->insert([
    //                         'denuncia_id' => $denunciaId,
    //                         'file_path'   => 'denuncias/' . $denunciaId . '/' . $newName
    //                     ]);
    //                 }
    //             }
    //         }


    //         $this->seguimientoDenunciasModel->insert([
    //             'denuncia_id' => $denunciaId,
    //             'comentario'     => 'Denuncia registrada en el sistema',
    //         ]);


    //         if (!empty($denuncianteId)) {
    //             $denunciante = $this->denunciantesModel->find($denuncianteId);
    //             if ($denunciante && !empty($denunciante['email'])) {
    //                 $this->enviarCorreoTracking($denunciante['email'], $tracking);
    //             }
    //         }

    //         $db->transCommit();

    //         return $this->respondCreated([
    //             'success'       => true,
    //             'message'       => 'Denuncia registrada con éxito',
    //             'tracking_code' => $tracking,
    //             'denuncia_id'   => $denunciaId
    //         ]);

    //     } catch (\Exception $e) {
    //         $db->transRollback();
    //         return $this->failServerError("Error al registrar la denuncia: " . $e->getMessage());
    //     }
    // }

    public function create()
{
    $db = \Config\Database::connect();
    $db->transBegin();

    try {
        // 📌 1. Parsear JSON del request
        $denunciaData   = json_decode($this->request->getPost("denuncia"), true);
        $denunciadoData = json_decode($this->request->getPost("denunciado"), true);
        $denuncianteRaw = $this->request->getPost("denunciante");
        $denuncianteData = !empty($denuncianteRaw) ? json_decode($denuncianteRaw, true) : null;

        // 📌 2. Procesar denunciado
        $denunciadoId = null;
        if (!empty($denunciadoData) && !empty($denunciadoData['documento'])) {
            $denunciado = $this->denunciadosModel
                ->where('documento', $denunciadoData['documento'])
                ->first();

            if ($denunciado) {
                $denunciadoId = $denunciado['id'];
            } else {
                $this->denunciadosModel->insert([
                    'nombre'             => $denunciadoData['nombre'] ?? null,
                    'razon_social'       => $denunciadoData['razon_social'] ?? null,
                    'representante_legal'=> $denunciadoData['representante_legal'] ?? null,
                    'tipo_documento'     => $denunciadoData['tipo_documento'] ?? null,
                    'documento'          => $denunciadoData['documento'] ?? null,
                    'direccion'          => $denunciadoData['direccion'] ?? null,
                    'telefono'           => $denunciadoData['celular'] ?? null,
                ]);
                $denunciadoId = $this->denunciadosModel->getInsertID();
            }
        }

        // 📌 3. Procesar denunciante (solo si no es anónimo)
        $denuncianteId = null;
        if ((int)($denunciaData['es_anonimo'] ?? 0) === 0 && !empty($denuncianteData)) {
            if (!empty($denuncianteData['documento'])) {
                $denunciante = $this->denunciantesModel
                    ->where('documento', $denuncianteData['documento'])
                    ->first();

                if ($denunciante) {
                    $denuncianteId = $denunciante['id'];
                } else {
                    $this->denunciantesModel->insert([
                        'nombre'        => $denuncianteData['nombre'] ?? null,
                        'email'         => $denuncianteData['email'] ?? null,
                        'telefono'      => null,
                        'celular'       => $denuncianteData['celular'] ?? null,
                        'documento'     => $denuncianteData['documento'] ?? null,
                        'tipo_documento'=> $denuncianteData['tipo_documento'] ?? null,
                        'razon_social'  => $denuncianteData['razon_social'] ?? null,
                        'sexo'          => $denuncianteData['sexo'] ?? null,
                        'distrito'      => $denuncianteData['distrito'] ?? null,
                        'provincia'     => $denuncianteData['provincia'] ?? null,
                        'departamento'  => $denuncianteData['departamento'] ?? null,
                        'direccion'     => $denuncianteData['direccion'] ?? null,
                    ], true);
                    $denuncianteId = $this->denunciantesModel->getInsertID();
                }
            }
        }

        // 📌 4. Insertar denuncia
        $tracking = $this->generateTrackingCode();
        $denunciaId = $this->denunciasModel->insert([
            'tracking_code'   => $tracking,
            'es_anonimo'      => $denunciaData['es_anonimo'] ?? 0,
            'denunciante_id'  => $denuncianteId,
            'denunciado_id'   => $denunciadoId,
            'descripcion'     => $denunciaData['descripcion'] ?? null,
            'fecha_incidente' => $denunciaData['fecha_incidente'] ?? null,
            'estado'          => 'registrado',
            'lugar'           => $denunciaData['lugar'] ?? null
        ], true);

        if (!$denunciaId) {
            log_message('error', 'Errores de validación: ' . json_encode($this->denunciasModel->errors()));
            throw new \Exception("Error en validación de denuncia");
        }

        // 📌 5. Adjuntos
        $files = $this->request->getFiles();
        if (isset($files['adjuntos'])) {
            if (count($files['adjuntos']) > 10) {
                throw new \Exception("No se permiten más de 10 archivos adjuntos");
            }

            $uploadPath = FCPATH . 'denuncias/' . $denunciaId;
            if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);

            $allowedTypes = [
                'image/jpeg','image/png','image/webp','image/avif',
                'application/pdf','application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain','audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/x-m4a',
                'video/mp4','video/x-msvideo','video/avi','video/mpeg','video/ogg','video/webm',
                'application/zip','application/x-zip-compressed'
            ];

            foreach ($files['adjuntos'] as $file) {
                if ($file->isValid() && !$file->hasMoved()) {
                    if ($file->getSize() > 20 * 1024 * 1024) {
                        throw new \Exception("El archivo {$file->getClientName()} excede el límite de 20MB");
                    }
                    if (!in_array($file->getClientMimeType(), $allowedTypes)) {
                        throw new \Exception("Tipo de archivo no permitido: {$file->getClientMimeType()}");
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

        // 📌 6. Seguimiento inicial
        $this->seguimientoDenunciasModel->insert([
            'denuncia_id' => $denunciaId,
            'comentario'  => 'Denuncia registrada en el sistema',
        ]);

        // 📌 7. Enviar correo si corresponde
        if (!empty($denuncianteId)) {
            $denunciante = $this->denunciantesModel->find($denuncianteId);
            if ($denunciante && !empty($denunciante['email'])) {
                $this->enviarCorreoTracking($denunciante['email'], $tracking);
            }
        }

        $db->transCommit();

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
