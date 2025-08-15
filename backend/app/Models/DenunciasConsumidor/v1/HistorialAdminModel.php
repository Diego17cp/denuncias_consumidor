<?php namespace App\Models\DenunciasConsumidor\v1;

use CodeIgniter\Model;

class HistorialAdminModel extends Model
{
    protected $table            = 'historial_admin';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'solicitado_por', 
        'dni', 
        'accion', 
        'motivo'
    ];

    // Fechas
    protected $useTimestamps = true; 
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'fecha_accion'; 
    protected $updatedField  = 'updated_at';   

    
     // Inserta nuevo registro en el historial
     
    public function registrarAccion(string $solicitadoPor, string $dni, string $accion, string $motivo)
    {
        return $this->insert([
            'solicitado_por' => $solicitadoPor,
            'dni'            => $dni,
            'accion'         => $accion,
            'motivo'         => $motivo
        ]);
    }

   // Historial por DNI
    public function obtenerPorDni(string $dni)
    {
        return $this->where('dni', $dni)
                    ->orderBy('fecha_accion', 'DESC')
                    ->findAll();
    }

    // Obtener el historial mas reciente 
    public function obtenerHistorialCompleto()
    {
        return $this->orderBy('fecha_accion', 'DESC')->findAll();
    }
}
