<?php

namespace App\Models\DenunciasConsumidor\v1;

use CodeIgniter\Model;
use App\Models\DenunciasConsumidor\v1\DenunciadoModel;
use App\Models\DenunciasConsumidor\v1\DenuncianteModel;
use App\Models\DenunciasConsumidor\v1\AdjuntoModel;
use App\Services\MailService;

class DenunciaModel extends Model
{
    protected $table            = 'denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;

    protected $allowedFields    = [
        'tracking_code',
        'denunciante_id',
        'es_anonimo',
        'denunciado_id',
        'descripcion',
        'estado',
        'fecha_incidente',
        'lugar',
    ];

    // Fechas
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validaciones
    protected $validationRules = [
        'tracking_code'   => 'required|string|max_length[20]',
        'es_anonimo'      => 'required|in_list[0,1]',
        'denunciante_id'  => 'permit_empty|integer',
        'descripcion'     => 'required|string',
        'fecha_incidente' => 'required|valid_date',
        'denunciado_id'   => 'required|integer',
        'estado'          => 'required|string|max_length[20]',
        'lugar'           => 'permit_empty|string|max_length[50]',
    ];

    protected $validationMessages = [
        'tracking_code' => [
            'required' => 'El código de seguimiento es obligatorio.',
            'max_length' => 'El código de seguimiento no puede exceder los 50 caracteres.'
        ],
        'es_anonimo' => [
            'required' => 'Debe indicar si la denuncia es anónima.',
            'in_list'  => 'El valor de anonimato debe ser 0 o 1.'
        ],
        'descripcion' => [
            'required' => 'La descripción de la denuncia es obligatoria.'
        ],
        'fecha_incidente' => [
            'required'    => 'La fecha del incidente es obligatoria.',
            'valid_date'  => 'Debe proporcionar una fecha de incidente válida.'
        ],
        'denunciado_id' => [
            //'required' => 'Debe especificar la persona denunciada.',
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'denunciante_id' => [
            'required' => 'Debe especificar la persona denunciante.',
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ],
        'lugar' => [
            'max_length' => 'El campo lugar no puede exceder los 50 caracteres.'
        ]
    ];

    protected $skipValidation = false;
    protected $cleanValidationRules = true;

    private $denunciadoModel;
    private $denuncianteModel;
    private $adjuntoModel;
    private $emailService;

    public function __construct()
    {
        parent::__construct();
        $this->denunciadoModel  = new DenunciadoModel();
        $this->denuncianteModel = new DenuncianteModel();
        $this->adjuntoModel     = new AdjuntoModel();
        $this->emailService     = new MailService();
    }

    // Métodos personalizados
    public function obtenerPorEstado(string $estado): array
    {
        return $this->where('estado', $estado)->findAll();
    }

    public function obtenerPorTracking(string $trackingCode)
    {
        return $this->where('tracking_code', $trackingCode)->first();
    }

    public function generateTrackingCode()
    {
        do {
            $trackingCode = 'TD' . strtoupper(bin2hex(random_bytes(4)));
        } while ($this->obtenerPorTracking($trackingCode));
        return $trackingCode;
    }
    public function createDenuncia(array $data, array $files)
    {
        $db = \Config\Database::connect();
        $db->transBegin();
        try {
            $denunciaData = json_decode($data["denuncia"], true);
            $denunciadoData = json_decode($data["denunciado"], true);
            $denuncianteRaw = $data["denunciante"];
            $denuncianteData = !empty($denuncianteRaw) ? json_decode($denuncianteRaw, true) : null;

            $denunciadoID = null;
            if (!empty($denunciadoData) && !empty($denunciadoData['documento'])) {
                $denunciado = $this->denunciadoModel->getByDocument($denunciadoData['documento']);
                if ($denunciado) $denunciadoID = $denunciado['id'];
                else {
                    $this->denunciadoModel->insert([
                        'nombre'             => $denunciadoData['nombre'] ?? null,
                        'razon_social'       => $denunciadoData['razon_social'] ?? null,
                        'representante_legal' => $denunciadoData['representante_legal'] ?? null,
                        'tipo_documento'     => $denunciadoData['tipo_documento'] ?? null,
                        'documento'          => $denunciadoData['documento'] ?? null,
                        'direccion'          => $denunciadoData['direccion'] ?? null,
                        'telefono'           => $denunciadoData['celular'] ?? null,
                    ]);
                    $denunciadoID = $this->denunciadoModel->getInsertID();
                }
            }

            $denuncianteID = null;
            if ((int)($denunciaData['es_anonimo'] ?? 0) === 0 && !empty($denuncianteData)) {
                if (!empty($denuncianteData['documento'])) {
                    $denunciante = $this->denuncianteModel->getByDocument($denuncianteData['documento']);
                    if ($denunciante) $denuncianteID = $denunciante['id'];
                    else {
                        $this->denuncianteModel->insert([
                            'nombre'        => $denuncianteData['nombre'] ?? null,
                            'email'         => $denuncianteData['email'] ?? null,
                            'telefono'      => null,
                            'celular'       => $denuncianteData['celular'] ?? null,
                            'documento'     => $denuncianteData['documento'] ?? null,
                            'tipo_documento' => $denuncianteData['tipo_documento'] ?? null,
                            'razon_social'  => $denuncianteData['razon_social'] ?? null,
                            'sexo'          => $denuncianteData['sexo'] ?? null,
                            'distrito'      => $denuncianteData['distrito'] ?? null,
                            'provincia'     => $denuncianteData['provincia'] ?? null,
                            'departamento'  => $denuncianteData['departamento'] ?? null,
                            'direccion'     => $denuncianteData['direccion'] ?? null,
                        ], true);
                        $denuncianteID = $this->denuncianteModel->getInsertID();
                    }
                }
            }
            $trackingCode = $this->generateTrackingCode();
            $denunciaID = $this->insert([
                'tracking_code' => $trackingCode,
                'es_anonimo' => $denunciaData['es_anonimo'] ?? 0,
                'denunciante_id' => $denuncianteID,
                'denunciado_id' => $denunciadoID,
                'descripcion' => $denunciaData['descripcion'] ?? null,
                'fecha_incidente' => $denunciaData['fecha_incidente'] ?? null,
                'estado' => 'registrado',
                'lugar' => $denunciaData['lugar'] ?? null
            ], true);
            if (!$denunciaID) {
                $db->transRollback();
                log_message('error', 'Error de validación al registrar denuncia: ' . json_encode($this->errors()));
                return ['success' => false, 'errors' => $this->errors()];
            }
            if (isset($files['adjuntos'])) {
                if (count($files['adjuntos']) > 10) {
                    throw new \Exception('Se permiten un máximo de 10 archivos adjuntos');
                }
                $uploadPath = FCPATH . 'uploads/adjuntos_denuncias/' . $denunciaID . '/';
                if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);
                $allowedTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                    'image/avif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                    'audio/mpeg',
                    'audio/mp3',
                    'audio/wav',
                    'audio/ogg',
                    'audio/x-m4a',
                    'video/mp4',
                    'video/x-msvideo',
                    'video/avi',
                    'video/mpeg',
                    'video/ogg',
                    'video/webm',
                    'application/zip',
                    'application/x-zip-compressed'
                ];
                foreach ($files['adjuntos'] as $file) {
                    if ($file->isValid() && !$file->hasMoved()) {
                        if ($file->getSize() > 20 * 1024 * 1024) throw new \Exception("El archivo {$file->getClientName()} excede el límite de 20MB");
                        if (!in_array($file->getClientMimeType(), $allowedTypes)) throw new \Exception("Tipo de archivo no permitido: {$file->getClientMimeType()}");
                        $fileName = $file->getRandomName();
                        $file->move($uploadPath, $fileName);

                        $this->adjuntoModel->insert([
                            'denuncia_id' => $denunciaID,
                            'file_path' => $uploadPath . '/' . $fileName
                        ]);
                    }
                }
            }
            if (!empty($denuncianteID)) {
                $denunciante = $this->denuncianteModel->find($denuncianteID);
                if ($denunciante && !empty($denunciante['email'])) $this->emailService->sendTrackingMail($denunciante['email'], $trackingCode);
            }
            $db->transCommit();

            return [
                'success' => true,
                'message' => 'Denuncia registrada con éxito',
                'tracking_code' => $trackingCode
            ];
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Error al crear denuncia: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error al procesar la denuncia: ' . $e->getMessage(),
                'errors' => $this->errors()
            ];
        }
    }

    public function insertarDenuncia(array $data)
    {
        if ($this->insert($data)) {
            return $this->getInsertID();
        }
        return false;
    }


    // public function recibirDenuncia($trackingCode, $estado, $comentario, $seguimientoData)
    // {
    //     $denuncia = $this->where('tracking_code', $trackingCode)->first();

    //     if (!$denuncia) {
    //         return false;
    //     }

    //     $this->where('id', $denuncia['id'])
    //         ->set(
    //             ['estado' => $estado],
    //             ['comentario' => $comentario]
    //         )
    //         ->update();

    //     $seguimientoModel = new \App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel();
    //     $seguimientoData['denuncia_id'] = $denuncia['id'];
    //     $seguimientoModel->insert($seguimientoData);

    //     return true;
    // }

    public function recibirDenuncia($trackingCode, $estado, $comentario, $seguimientoData)
    {
        
        $denuncia = $this->where('tracking_code', $trackingCode)->first();

        if (!$denuncia) {
            return false;
        }

        // Actualizar estado y comentario en la denuncia
        $this->update($denuncia['id'], [
            'estado' => $estado
        ]);

        // Insertar el seguimiento
        $seguimientoModel = new \App\Models\DenunciasConsumidor\v1\SeguimientoDenunciaModel();
        $seguimientoData['denuncia_id'] = $denuncia['id'];
        $seguimientoModel->insert($seguimientoData);

        // Traer la denuncia actualizada
        $denunciaActualizada = $this->find($denuncia['id']);

        // Ultimo seguimiento insertado
        $ultimoSeguimiento = $seguimientoModel->find($seguimientoModel->getInsertID());

        return [
            'denuncia'   => $denunciaActualizada,
            'seguimiento'=> $ultimoSeguimiento
        ];
    }



    public function searchByDocumento($documento)
    {
        return $this->select('denuncia.*')
            ->join('denunciante', 'denunciante.id = denuncia.denunciante_id')
            ->where('denunciante.documento', $documento)
            ->where('denuncia.deleted_at', null)
            ->findAll();
    }

    public function searchByDenuncianteId($denuncianteId)
    {
        return $this->select('denuncia.*')
            ->where('denuncia.denunciante_id', $denuncianteId)
            ->where('denuncia.deleted_at', null)
            ->findAll();
    }

    public function searchByDocumentoDenunciado($documento)
    {
        return $this->select('denuncia.*, denunciado.nombre AS nombre_denunciado, denunciado.documento')
                    ->join('denunciado', 'denunciado.id = denuncia.denunciado_id')
                    ->where('denunciado.documento', $documento)
                    ->first(); // O ->findAll() si quieres varias denuncias
    }

    public function DenunciasRegistradas($perPage = 10, $page = 1)
    {
        return $this->select('denuncia.*, 
                            denunciante.nombre AS denunciante_nombre, 
                            denunciado.nombre AS denunciado_nombre')
                    ->join('denunciante', 'denunciante.id = denuncia.denunciante_id', 'left')
                    ->join('denunciado', 'denunciado.id = denuncia.denunciado_id', 'left')
                    ->where('denuncia.estado', 'registrado')
                    ->orderBy('denuncia.created_at', 'DESC')
                    ->paginate($perPage, 'default', $page);
    }

    public function DenunciasActivas($perPage = 2 , $page = null)
    {
        return $this->whereIn('estado', ['recibida', 'en proceso', 'pendiente'])
                    ->orderBy('created_at', 'DESC') 
                    ->paginate($perPage);
    }

}
