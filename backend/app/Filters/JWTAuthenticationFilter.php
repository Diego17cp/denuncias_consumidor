<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\Denuncia_consumidor\AdministradorModel;

helper("cookie");
helper("jwt");

class JWTAuthenticationFilter implements FilterInterface
{

    public function before(RequestInterface $request, $arguments = null)
    {
        $token = get_cookie('access_token');
        if (!$token) return service("response")->setJSON(["error" => "No access token found"])->setStatusCode(401);

        try {
            $decoded = verifyJWT($token);
            $dni = null;
            if (is_array($decoded)) {
                $dni = $decoded['data']['dni'] ?? null;
            } elseif (is_object($decoded)) {
                if (isset($decoded->data)) {
                    $dni = is_object($decoded->data) ? ($decoded->data->dni ?? null) : ($decoded->data['dni'] ?? null);
                }
            }
            if (!$dni) return service("response")->setJSON(["error" => "Invalid token data"])->setStatusCode(401);
        } catch (\Exception $e) {
            return service("response")->setJSON(["error" => "Error with token: " . $e->getMessage()])->setStatusCode(401);
        }
        $adminModel = new AdministradorModel();
        $admin = $adminModel->where('dni', $dni)->first();
        log_message('info', 'Admin data retrieved: ' . json_encode($admin));
        $adminState = isset($admin['estado']) ? strtolower((string)$admin['estado']) : null;
        if (!$admin || !in_array($adminState, ['1', 'activo', 'active', 'true'], true)) return service("response")->setJSON(["error" => "Usuario inactivo o inexistente."])->setStatusCode(401);
        if ($arguments && !in_array($admin["rol"], $arguments)) return service("response")->setJSON(["error" => "Permisos insuficientes."])->setStatusCode(403);
    }

    /**
     * Allows After filters to inspect and modify the response
     * object as needed. This method does not allow any way
     * to stop execution of other after filters, short of
     * throwing an Exception or Error.
     *
     * @param RequestInterface  $request
     * @param ResponseInterface $response
     * @param array|null        $arguments
     *
     * @return ResponseInterface|void
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
