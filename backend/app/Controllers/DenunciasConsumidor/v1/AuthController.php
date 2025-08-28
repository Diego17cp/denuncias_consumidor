<?php
namespace App\Controllers\DenunciasConsumidor\v1;
use CodeIgniter\RESTful\ResourceController;
use App\Models\DenunciasConsumidor\v1\AdministradorModel;
use CodeIgniter\Cookie\Cookie;

helper('jwt');
helper('cookie');

class AuthController extends ResourceController
{
    private $adminModel;
    public function __construct()
    {
        $this->adminModel = new AdministradorModel();
    }
    public function testFilter()
    {
        return $this->response->setJSON(['message' => 'Filter valid']);
    }
    public function login()
    {
        $json = $this->request->getJSON();
        $dni = $json->dni ?? null;
        $password = $json->password ?? null;

        $user = $this->adminModel->getByDNI($dni);
        if (!$user || !password_verify($password, $user['password'])) {
            return service("response")
                ->setStatusCode(401)
                ->setJSON(['error' => 'Credenciales inválidas']);
        }

        // Verificar si está inactivo
        if ($user['estado'] === '0') {
            return service("response")
                ->setStatusCode(403)
                ->setJSON(['error' => 'Tu cuenta está inactiva, contacta con el administrador principal.']);
        }

        $jwt = createJWT([
            "id" => $user['id'],
            "dni" => $dni,
            "rol" => $user['rol'],
            "estado" => $user['estado']
        ]);
        $cookie = new Cookie(
            "access_token",
            $jwt,
            [
                "expires" => time() + 3600,
                "path" => "/",
                "secure" => false,
                "httponly" => true,
                "samesite" => Cookie::SAMESITE_LAX,
                "domain" => ""
            ]
        );
        $response = service("response");
        $response->setCookie($cookie);
        return $response->setJSON([
            "role_changed" => false,
            "user" => [
                "id" => $user['id'],
                "dni" => $dni,
                "estado" => $user['estado'],
                "rol" => $user['rol'],
                "nombre" => $user['nombre'] ?? 'Administrador',
            ]
        ])->setStatusCode(200);
    }
    public function logout()
    {
        $cookie = new Cookie(
            'access_token',
            '',
            [
                'expires' => time() - 3600,
                'path' => '/',
                'domain' => '',
                'httponly' => true,
                'samesite' => Cookie::SAMESITE_LAX
            ]
        );
        service("response")->setCookie($cookie);
        return $this->respond(['message' => 'Sesion cerrada.']);
    }
    public function refresh()
    {
        $token = get_cookie('access_token');
        if (!$token) {
            $this->logout();
            return service('response')
                ->setJSON(['error' => 'Token no válido', 'forceLogout' => true])
                ->setStatusCode(401);
        }
        try {
            $decoded = verifyJWT($token);
            if (
                !isset($decoded->data) ||
                !isset($decoded->data->id) ||
                !isset($decoded->data->dni) ||
                !isset($decoded->data->rol)
            ) throw new \Exception('Token inválido: Datos incompletos.');

            $adminModel = new AdministradorModel();
            $user = $adminModel->getByDNI($decoded->data->dni);
            if (!$user) {
                $this->logout();
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON(['error' => 'Usuario no encontrado', 'forceLogout' => true]);
            }
            $estado = isset($user['estado']) ? strtolower(trim((string)$user['estado'])) : null;
            if (! in_array($estado, ['1','activo','active','true'], true)) {
                $this->logout();
                return $this->response
                    ->setStatusCode(401)
                    ->setJSON(['error' => 'Tu cuenta ha sido desactivada', 'forceLogout' => true]);
            }
            $userRole = $user['rol'];
            $decodedRole = $decoded->data->rol;
            $roleChanged = ($userRole !== $decodedRole);
            if ($roleChanged) {
                $newToken = createJWT([
                    "id" => $user['id'],
                    "dni" => $user['dni'],
                    "rol" => $user['rol'],
                    "estado" => $user['estado']
                ]);
                $cookie = new Cookie(
                    "access_token",
                    $newToken,
                    [
                        "expires" => time() + 3600,
                        "path" => "/",
                        "secure" => false,
                        "httponly" => true,
                        "samesite" => Cookie::SAMESITE_LAX,
                        "domain" => ""
                    ]
                );
                $response = service("response");
                $response->setCookie($cookie);
                return $this->response
                    ->setJSON([
                        "role_changed" => $roleChanged,
                        "user" => [
                            "id" => $user['id'],
                            "dni" => $user['dni'],
                            "estado" => $user['estado'],
                            "rol" => $user['rol'],
                            "nombre" => $user['nombre'] ?? 'Administrador',
                        ]
                    ])
                    ->setStatusCode(200);
            }
            return $this->response
                ->setJSON([
                    "role_changed" => false,
                    "user" => [
                        "id" => $user['id'],
                        "dni" => $user['dni'],
                        "estado" => $user['estado'],
                        "rol" => $user['rol'],
                        "nombre" => $user['nombre'] ?? 'Administrador',
                    ]
                ])
                ->setStatusCode(200);

        } catch (\Throwable $e) {
            log_message('error', '[REFRESH ERROR] ' . $e->getMessage() . ' | ' . $e->getFile() . ':' . $e->getLine());
            $this->logout();
            return service('response')
                ->setJSON(['error' => 'Token no válido: ' . $e->getMessage(), 'forceLogout' => true])
                ->setStatusCode(401);
        }
    }
}