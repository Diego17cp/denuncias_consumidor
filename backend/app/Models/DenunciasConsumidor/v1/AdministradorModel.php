<?php

namespace App\Models\DenunciasConsumidor\v1;

use CodeIgniter\Model;

class AdministradorModel extends Model
{
    protected $DBGroup          = 'default';
    protected $table            = 'administrador';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;

    protected $allowedFields    = [
        'id',
        'dni',
        'nombre',
        'password',
        'rol',
        'estado'
    ];

    // Fechas 
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validaciones
    protected $validationRules = [
        'dni'      => 'required|numeric|min_length[8]|max_length[20]',
        'nombre'   => 'required|string|max_length[100]',
        'password' => 'required|string|min_length[8]|max_length[255]',
        'rol'      => 'required|string|max_length[50]',
        'estado'   => 'required|in_list[activo,inactivo,1,0]'
    ];

    protected $validationMessages = [
        'dni' => [
            'required'   => 'El campo DNI es obligatorio.',
            'numeric'    => 'El campo DNI debe contener solo números.',
            'min_length' => 'El campo DNI debe tener al menos {param} dígitos.',
            'max_length' => 'El campo DNI no puede exceder {param} dígitos.'
        ],
        'nombre' => [
            'required'   => 'El campo nombre es obligatorio.',
            'max_length' => 'El campo nombre no puede exceder {param} caracteres.'
        ],
        'password' => [
            'required'   => 'La contraseña es obligatoria.',
            'min_length' => 'La contraseña debe tener al menos {param} caracteres.',
            'max_length' => 'La contraseña no puede exceder {param} caracteres.'
        ],
        'rol' => [
            'required'   => 'El rol es obligatorio.',
            'max_length' => 'El rol no puede exceder {param} caracteres.'
        ],
        'estado' => [
            'required' => 'El estado es obligatorio.',
            'in_list'  => 'El estado debe ser "activo", "inactivo", 1 o 0.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Buscar administrador por DNI
    public function getByDNI(string $dni)
    {
        return $this->where('dni', $dni)->first();
    }

    // Verificación de credenciales ADMI
    public function verificarLogin(string $dni, string $password)
    {
        $admin = $this->getByDNI($dni);
        if ($admin && password_verify($password, $admin['password'])) {
            return $admin;
        }
        return null;
    }
}
