<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTables extends Migration
{
    public function up()
    {
        // Create 'denunciado' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => false
            ],
            'documento' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'CE', 'RUC'],
                'null' => false
            ],
            'representante_legal' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'razon_social' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'direccion' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'celular' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denunciado');

        // Create 'denunciante' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'razon_social' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'documento' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'tipo_documento' => [
                'type' => 'ENUM',
                'constraint' => ['DNI', 'CE', 'RUC'],
                'null' => false
            ],
            'direccion' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => true
            ],
            'distrito' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'provincia' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'departamento' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'email' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => false
            ],
            'celular' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'telefono' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => true
            ],
            'sexo' => [
                'type' => 'ENUM',
                'constraint' => ['M', 'F'],
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('denunciante');

        // Create 'denuncia' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'tracking_code' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'denunciante_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => true
            ],
            'es_anonimo' => [
                'type' => 'TINYINT',
                'constraint' => 1,
                'null' => false
            ],
            'denunciado_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'descripcion' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'estado' => [
                'type' => 'VARCHAR',
                'constraint' => '20',
                'null' => false
            ],
            'lugar' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => true
            ],
            'fecha_incidente' => [
                'type' => 'DATE',
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denunciante_id', 'denunciante', 'id', 'NO ACTION', 'SER NULL');
        $this->forge->addForeignKey('denunciado_id', 'denunciado', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('denuncia');

        // Create 'adjunto' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'denuncia_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'file_path' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncia', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('adjunto');

        // Create 'administrador' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'nombre' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'dni' => [
                'type' => 'VARCHAR',
                'constraint' => '8',
                'null' => false
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'rol' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => false
            ],
            'estado' => [
                'type' => 'ENUM',
                'constraint' => ['1', '0'],
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('administrador');

        // Create 'seguimiento_denuncia' table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'denuncia_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'administrador_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'comentario' => [
                'type' => 'TEXT',
                'null' => false
            ],
            'estado' => [
                'type' => "VARCHAR",
                'constraint' => "100",
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('denuncia_id', 'denuncia', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('administrador_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('seguimiento_denuncia');

        // Create historial_admin table
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'unsigned' => true,
                'auto_increment' => true
            ],
            'administrador_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'afectado_id' => [
                'type' => 'INT',
                'unsigned' => true,
                'null' => false
            ],
            'accion' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => false
            ],
            'motivo' => [
                'type' => 'VARCHAR',
                'constraint' => '255',
                'null' => false
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true
            ],
            'deleted_at' => [
                'type' => 'DATETIME',
                'null' => true
            ]
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('administrador_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->addForeignKey('afectado_id', 'administrador', 'id', 'NO ACTION', 'CASCADE');
        $this->forge->createTable('historial_admin');
    }

    public function down()
    {
        // Drop children first to avoid FK constraint errors
        $this->forge->dropTable('seguimiento_denuncia', true);
        $this->forge->dropTable('adjunto', true);
        $this->forge->dropTable('denuncia', true);
        // Then parents
        $this->forge->dropTable('denunciado', true);
        $this->forge->dropTable('denunciante', true);
        $this->forge->dropTable('administrador', true);
    }
}
