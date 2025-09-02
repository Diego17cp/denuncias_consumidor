<?php namespace App\Models\DenunciasConsumidor\v1;

use CodeIgniter\Model;

class SeguimientoDenunciaModel extends Model
{
    protected $table            = 'seguimiento_denuncia';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;

    protected $allowedFields    = [
        'denuncia_id',
        'comentario',
        'administrador_id',
        'estado'
    ];

    // Manejo automático de fechas
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField = 'deleted_at';

    // Validaciones
    protected $validationRules = [
        'denuncia_id'     => 'required|integer',
        'comentario'      => 'permit_empty|string|max_length[500]',
        'administrador_id'=> 'required|integer',
        'estado'           => 'required|string|max_length[100]'
    ];

    protected $validationMessages = [
        'denuncia_id' => [
            'required' => 'El ID de la denuncia es obligatorio',
            'integer'  => 'El ID de la denuncia debe ser un número entero'
        ],
        'comentario' => [
            'max_length' => 'El comentario no puede exceder los 500 caracteres'
        ],
        'administrador_id' => [
            'required' => 'El ID del administrador es obligatorio',
            'integer'  => 'El ID del administrador debe ser un número entero'
        ],
        'estado' => [
            'required'   => 'El estado es obligatorio',
            'max_length' => 'El estado no puede exceder los 100 caracteres'
        ]
    ];

    protected $skipValidation = false;

     // Obtiener siguimiento de las denuncias por su ID 
    
    public function obtenerPorDenunciaId(int $denunciaId)
    {
        return $this->where('denuncia_id', $denunciaId)
                    ->orderBy('created_at', 'DESC')
                    ->findAll();
    }

    // Obtener el historial de estados de una denuncia por su ID
    public function HistorialEstados(int $denunciaId): array
    {
        return $this->db->table($this->table)
            ->select('
                seguimiento_denuncia.estado,
                seguimiento_denuncia.comentario,
                seguimiento_denuncia.created_at AS fecha,
                administrador.nombre AS administrador
            ')
            ->join('administrador', 'administrador.id = seguimiento_denuncia.administrador_id')
            ->where('seguimiento_denuncia.denuncia_id', $denunciaId)
            ->orderBy('seguimiento_denuncia.created_at', 'ASC')
            ->get()
            ->getResultArray();
    }

}
