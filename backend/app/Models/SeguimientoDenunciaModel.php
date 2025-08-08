<?php namespace App\Models;

use CodeIgniter\Model;

class SeguimientoDenunciaModel extends Model
{
    protected $table      = 'seguimiento_denuncia';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'denuncia_id', 'estado', 'comentario', 'fecha_actualizacion', 'administrador_id'
    ];

    protected $useTimestamps = false;
}
