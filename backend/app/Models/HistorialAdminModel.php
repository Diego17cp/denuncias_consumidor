<?php namespace App\Models;

use CodeIgniter\Model;

class HistorialAdminModel extends Model
{
    protected $table      = 'historial_admin';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'solicitado_por', 'dni', 'accion', 'motivo', 'fecha_accion'
    ];

    protected $useTimestamps = false;
}
