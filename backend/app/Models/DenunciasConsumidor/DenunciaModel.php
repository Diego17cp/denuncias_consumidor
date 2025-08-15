<?php namespace App\Models\Denuncia_consumidor;

use CodeIgniter\Model;

class DenunciaModel extends Model
{
    protected $table            = 'denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'tracking_code',
        'es_anonimo',
        'denunciante_id',
        'motivo_otro',
        'descripcion',
        'fecha_incidente',
        'denunciado_id',
        'fecha_registro',
        'estado',
        'pdf_path'
    ];

    // Fechas
    protected $useTimestamps = true; 
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validaciones
    protected $validationRules = [
        'tracking_code'   => 'required|string|max_length[50]',
        'es_anonimo'      => 'required|in_list[0,1]',
        'denunciante_id'  => 'permit_empty|integer',
        'motivo_otro'     => 'permit_empty|string|max_length[255]',
        'descripcion'     => 'required|string',
        'fecha_incidente' => 'required|valid_date',
        'denunciado_id'   => 'required|integer',
        'fecha_registro'  => 'permit_empty|valid_date',
        'estado'          => 'required|string|max_length[50]',
        'pdf_path'        => 'permit_empty|string|max_length[255]',
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
            'required' => 'Debe especificar la persona denunciada.',
            'integer'  => 'El ID del denunciado debe ser un número entero.'
        ]
    ];

    protected $skipValidation = false;

    // Métodos personalizados
    public function obtenerPorEstado(string $estado): array
    {
        return $this->where('estado', $estado)->findAll();
    }

    public function obtenerPorTracking(string $trackingCode)
    {
        return $this->where('tracking_code', $trackingCode)->first();
    }

    public function insertarDenuncia(array $data)
    {
        if ($this->insert($data)) {
            return $this->getInsertID();
        }
        return false;
    }
}
