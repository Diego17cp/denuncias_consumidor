<?php namespace App\Models;

use CodeIgniter\Model;

class AdministradorModel extends Model
{
    protected $table      = 'administrador';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'dni', 'nombre', 'password', 'rol', 'estado'
    ];

    protected $useTimestamps = false;
}
