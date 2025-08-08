<?php namespace App\Models;

use CodeIgniter\Model;

class DenunciaModel extends Model
{
    protected $table      = 'denuncia';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'tracking_code', 'es_anonimo', 'denunciante_id', 'motivo_otro',
        'descripcion', 'fecha_incidente', 'denunciado_id',
        'fecha_registro', 'estado', 'pdf_path'
    ];

    protected $useTimestamps = false;

    // Opcional: métodos personalizados
    public function obtenerPorEstado($estado)
    {
        return $this->where('estado', $estado)->findAll();
    }
}
