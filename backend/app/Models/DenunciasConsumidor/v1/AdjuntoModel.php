<?php

namespace App\Models\DenunciasConsumidor\v1;

use CodeIgniter\Model;

class AdjuntoModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'adjunto';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;

    protected $allowedFields = [
        'denuncia_id',
        'file_path',
        // 'file_name',
        // 'file_type',
        // 'fecha_subida'
    ];

    // Fechas 
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validaciones
    protected $validationRules = [
        'denuncia_id' => 'required|integer',
        'file_path'   => 'required|string|max_length[255]',
        // 'file_name'   => 'required|string|max_length[100]',
        // 'file_type'   => 'required|string|max_length[50]',
        // 'fecha_subida'=> 'permit_empty|valid_date[Y-m-d H:i:s]'
    ];

    protected $validationMessages = [
        'denuncia_id' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'file_path' => [
            'required'   => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        // 'file_name' => [
        //     'required'   => 'El campo {field} es obligatorio.',
        //     'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        // ],
        // 'file_type' => [
        //     'required'   => 'El campo {field} es obligatorio.',
        //     'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        // ],
        // 'fecha_subida' => [
        //     'valid_date' => 'El campo {field} debe tener un formato válido (Y-m-d H:i:s).'
        // ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Insertar nuevo adjunto
    public function insertAdjunto(array $data)
    {
        return $this->insert($data, true); 
    }

    // Obtiene adjuntos por el ID de la denuncia
    public function getByDenunciaId(int $denunciaId)
    {
        return $this->where('denuncia_id', $denunciaId)->findAll();
    }
}
