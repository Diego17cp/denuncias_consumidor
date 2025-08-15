<?php namespace App\Models\Denuncia_consumidor;

use CodeIgniter\Model;

class DenuncianteModel extends Model
{
    protected $table      = 'denunciante';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nombre', 'email', 'telefono', 'numero_documento',
        'tipo_documento', 'razon_social', 'sexo', 
        'distrito', 'provincia', 'departamento', 'direccion'
    ];

    // Fechas 
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validaciones
    protected $validationRules = [
        'nombre'           => 'required|min_length[3]|max_length[100]',
        'email'            => 'required|valid_email|max_length[150]',
        'telefono'         => 'required|regex_match[/^[0-9]{7,15}$/]',
        'numero_documento' => 'required|numeric|max_length[15]',
        'tipo_documento'   => 'required|in_list[DNI,CE,RUC]',
        'razon_social'     => 'permit_empty|max_length[150]',
        'sexo'             => 'required|in_list[M,F,O]',
        'distrito'         => 'required|max_length[100]',
        'provincia'        => 'required|max_length[100]',
        'departamento'     => 'required|max_length[100]',
        'direccion'        => 'required|max_length[255]'
    ];

    // Mensajes de las validaciones
    protected $validationMessages = [
        'nombre' => [
            'required'   => 'El nombre es obligatorio',
            'min_length' => 'El nombre debe tener al menos 3 caracteres',
            'max_length' => 'El nombre no puede superar los 100 caracteres'
        ],
        'email' => [
            'required'    => 'El correo es obligatorio',
            'valid_email' => 'Debe ser un correo válido',
            'max_length'  => 'El correo no puede superar los 150 caracteres'
        ],
        'telefono' => [
            'required'    => 'El teléfono es obligatorio',
            'regex_match' => 'El teléfono debe tener entre 7 y 15 dígitos numéricos'
        ],
        'numero_documento' => [
            'required'   => 'El número de documento es obligatorio',
            'numeric'    => 'El documento debe contener solo números',
            'max_length' => 'El documento no puede superar los 15 dígitos'
        ],
        'tipo_documento' => [
            'required' => 'El tipo de documento es obligatorio',
            'in_list'  => 'Tipo de documento inválido (DNI, CE o Pasaporte)'
        ],
        'razon_social' => [
            'max_length' => 'La razón social no puede superar los 150 caracteres'
        ],
        'sexo' => [
            'required' => 'El sexo es obligatorio',
            'in_list'  => 'El sexo debe ser M (Masculino), F (Femenino) o O (Otro)'
        ],
        'distrito' => [
            'required'   => 'El distrito es obligatorio',
            'max_length' => 'El distrito no puede superar los 100 caracteres'
        ],
        'provincia' => [
            'required'   => 'La provincia es obligatoria',
            'max_length' => 'La provincia no puede superar los 100 caracteres'
        ],
        'departamento' => [
            'required'   => 'El departamento es obligatorio',
            'max_length' => 'El departamento no puede superar los 100 caracteres'
        ],
        'direccion' => [
            'required'   => 'La dirección es obligatoria',
            'max_length' => 'La dirección no puede superar los 255 caracteres'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
