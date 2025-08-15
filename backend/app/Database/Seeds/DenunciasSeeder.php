<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\DenunciasConsumidor\v1\AdministradorModel;

class DenunciasSeeder extends Seeder
{
    public function run()
    {
        // Seeder with Martha engineer by default
        $adminModel = new AdministradorModel();
        $adminData = [
            "dni" => "40346175",
            "nombre" => "TUÑOQUE JULCAS MARTHA LUZ",
            "password" => password_hash("40346175", PASSWORD_BCRYPT),
            "rol" => "super_admin",
            "estado" => "1"
        ];
        $this->db->table('administrador')->insertBatch($adminData);
    }
}
