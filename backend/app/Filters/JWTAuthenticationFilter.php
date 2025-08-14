<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Models\Denuncia_consumidor\AdministradorModel;

helper("cookie");

class JWTAuthenticationFilter implements FilterInterface
{

    public function before(RequestInterface $request, $arguments = null)
    {
        $token = get_cookie('access_token');
        if (!$token) return service("response")->setJSON(["error" => "No access token found"])->setStatusCode(401);

        try {
            $decoded = verifyJWT($token);
            $dni = $decoded['data']['dni'] ?? null;
            if (!$dni) return service("response")->setJSON(["error" => "Invalid token data"])->setStatusCode(401);
        } catch (\Exception $e) {
            return service("response")->setJSON(["error" => "Error with token: " . $e->getMessage()])->setStatusCode(401);
        }
        $adminModel = new AdministradorModel();
        $admin = $adminModel->where('dni', $dni)->first();
        if (!$admin || $admin["estado"] !== "1") return service("response")->setJSON(["error" => "Usuario inactivo o inexistente."])->setStatusCode(401);
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
