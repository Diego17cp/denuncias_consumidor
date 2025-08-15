<?php

namespace App\Controllers\Denuncias_consumidor;

use CodeIgniter\RESTful\ResourceController;

class ConsultaApi extends ResourceController
{
    private string $apiUrlDNI = 'http://161.132.51.161/mdjlo/api/open/dni';
    private string $apiUrlRUC = 'http://161.132.51.161/mdjlo/api/open/ruc';
    private string $token;

    public function __construct()
    {
        $this->token = getenv('API_TOKEN') ?: '';
    }

    public function buscarDNI(string $dni)
    {
        return $this->buscarDocumento($this->apiUrlDNI, $dni, 'DNI');
    }

    public function buscarRUC(string $ruc)
    {
        return $this->buscarDocumento($this->apiUrlRUC, $ruc, 'RUC');
    }

    /**
     * Método genérico para buscar por documento
     */
    private function buscarDocumento(string $url, string $documento, string $tipo)
    {
        $response = $this->consultarApi($url, $documento);

        if (!empty($response['data'])) {
            return $this->respond([
                'success' => true,
                'data'    => $response['data']
            ], 200);
        }

        return $this->failNotFound("$tipo no encontrado");
    }

    /**
     * Realiza la consulta a la API externa
     */
    private function consultarApi(string $url, string $documento): ?array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode(['documento' => $documento]),
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->token
            ],
            CURLOPT_TIMEOUT        => 10
        ]);

        $response = curl_exec($ch);
        $error    = curl_error($ch);
        curl_close($ch);

        if ($error) {
            log_message('error', "Error consultando API externa: $error");
            return null;
        }

        return json_decode($response, true);
    }
}
