<?php

namespace App\Controllers\Denuncia_consumidor;

use App\Controllers\BaseController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Denuncia_consumidor\AdministradorModel;

class VerificarAdmi extends BaseController
{
    private $adminModel;
    private $jwtKey = 'your-secret-key'; 

    public function __construct()
    {
        $this->adminModel = new AdministradorModel();
    }

    /**
     * Login de administrador
     */
    public function login()
    {
        $data = $this->request->getJSON(true);
        $dni = $data['dni'] ?? '';
        $password = $data['password'] ?? '';

        // Verificar usuario
        $admin = $this->adminModel->getByDNI($dni);
        if (!$admin) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado']);
        }

        // Verificar estado
        if ($admin['estado'] !== 'activo') {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Cuenta desactivada']);
        }

        // Verificar password
        if (!password_verify($password, $admin['password'])) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Contraseña incorrecta']);
        }

        // Generar token
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600,
            'dni' => $admin['dni'],
            'rol' => $admin['rol'],
            'estado' => $admin['estado']
        ];

        $token = JWT::encode($payload, $this->jwtKey, 'HS256');

        // Guardar cookie
        $this->response->setCookie([
            'name'     => 'auth_token',
            'value'    => $token,
            'expire'   => time() + 3600,
            'path'     => '/',
            'secure'   => false, // cambia a true si usas HTTPS
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        return $this->response->setJSON([
            'success' => true,
            'user' => [
                'dni' => $admin['dni'],
                'nombre' => $admin['nombre'],
                'rol' => $admin['rol'],
                'estado' => $admin['estado']
            ]
        ]);
    }

    /**
     * Obtener info del administrador autenticado
     */
    public function getAdminInfo()
    {
        $auth = $this->checkAuth();
        if (isset($auth['error'])) {
            return $this->response->setStatusCode(401)->setJSON($auth);
        }

        $admin = $this->adminModel->getByDNI($auth['dni']);
        if (!$admin) {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Usuario no encontrado', 'forceLogout' => true]);
        }

        return $this->response->setJSON([
            'success' => true,
            'user' => $admin
        ]);
    }

    /**
     * Logout
     */
    public function logout()
    {
        $this->response->setCookie([
            'name'   => 'auth_token',
            'value'  => '',
            'expire' => time() - 3600,
            'path'   => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Strict'
        ]);

        return $this->response->setJSON(['success' => true]);
    }

    /**
     * Verifica y decodifica el token
     */
    private function checkAuth()
    {
        $token = $this->request->getCookie('auth_token');
        if (!$token) {
            return ['error' => 'No autorizado', 'forceLogout' => true];
        }

        try {
            $decoded = JWT::decode($token, new Key($this->jwtKey, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return ['error' => 'Token inválido o expirado', 'forceLogout' => true];
        }
    }
}
