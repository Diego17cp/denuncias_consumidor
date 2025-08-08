<?php namespace App\Models;

use CodeIgniter\Model;

class DenunciadoModel extends Model
{
    protected $table      = 'denunciado';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nombre', 'tipo_documento', 'direccion', 'telefono'
    ];

    protected $useTimestamps = false;
}
