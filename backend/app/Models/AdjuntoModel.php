<?php namespace App\Models;

use CodeIgniter\Model;

class AdjuntoModel extends Model
{
    protected $table      = 'adjunto';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'denuncia_id', 'file_path', 'file_name', 'file_type', 'fecha_subida'
    ];

    protected $useTimestamps = false;
}
