<?php namespace App\Models;

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

    protected $useTimestamps = false;
}
