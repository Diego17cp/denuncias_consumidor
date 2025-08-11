<?php

namespace App\Models\Denuncia_consumidor;

use CodeIgniter\Model;

class DenunciadoModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'denunciado';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'nombre',
        'tipo_documento',
        'direccion',   
        'telefono'     
    ];

    // Fechas 
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validaciones
    protected $validationRules = [
        'nombre'         => 'required|min_length[3]|max_length[255]',
        'tipo_documento' => 'required|in_list[DNI,CEDULA,RUC]',
        'direccion'      => 'permit_empty|max_length[50]',
        'telefono'       => 'permit_empty|max_length[20]'
    ];

    protected $validationMessages = [
        'nombre' => [
            'required'    => 'El campo {field} es obligatorio.',
            'min_length'  => 'El campo {field} debe tener al menos {param} caracteres.',
            'max_length'  => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'tipo_documento' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list'  => 'El {field} debe ser uno de: DNI, CEDULA o RUC.'
        ],
        'direccion' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'telefono' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
