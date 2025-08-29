<?php

namespace App\Models\DenunciasConsumidor\v1;


use CodeIgniter\Model;


class HistorialAdminModel extends Model
{
    protected $table            = 'historial_admin';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;

    protected $allowedFields    = [
        'administrador_id',
        'afectado_id',
        'accion',
        'motivo'
    ];

    
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';


    protected $validationRules = [
        'administrador_id' => 'required|integer',
        'afectado_id'      => 'required|integer',
        'accion'           => 'required|string|max_length[50]',
        'motivo'           => 'required|string|max_length[255]'
    ];

    protected $validationMessages = [
        'administrador_id' => [
            'required' => 'El ID del administrador que realiza la acción es obligatorio',
            'integer'  => 'El ID del administrador debe ser un número entero'
        ],
        'afectado_id' => [
            'required' => 'El ID del usuario afectado es obligatorio',
            'integer'  => 'El ID del usuario afectado debe ser un número entero'
        ],
        'accion' => [
            'required'   => 'La acción es obligatoria',
            'max_length' => 'La acción no puede exceder los 50 caracteres'
        ],
        'motivo' => [
            'required'   => 'El motivo es obligatorio',
            'max_length' => 'El motivo no puede exceder los 255 caracteres'
        ]
    ];

    protected $skipValidation = false;

    // Obtener el historial con detalles de administradores y afectados
    public function getHistorialConDetalles($perPage = 5)
    {
        return $this->select('
                historial_admin.id,
                historial_admin.accion,
                historial_admin.motivo,
                historial_admin.created_at,
                admin.nombre AS nombre_administrador,
                admin.dni AS dni_administrador,
                afectado.nombre AS nombre_afectado,
                afectado.dni AS dni_afectado
            ')
            ->join('administrador AS admin', 'admin.id = historial_admin.administrador_id')
            ->join('administrador AS afectado', 'afectado.id = historial_admin.afectado_id')
            ->orderBy('historial_admin.created_at', 'DESC')
            ->paginate($perPage);
    }
}