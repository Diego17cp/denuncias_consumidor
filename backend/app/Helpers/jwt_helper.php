<?php

use Config\Services;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function createJWT($userData)
{
    $key = Services::getSecretKey();
    if (!$key) throw new Exception('JWT secret key not set in environment variables.');
    $payload = [
        "iat" => time(),
        "exp" => time() + Services::getTokenExpiration(),
        "data" => $userData
    ];
    return JWT::encode($payload, $key, 'HS256');
}
function verifyJWT($token)
{
    $key = Services::getSecretKey();
    if (!$key) throw new Exception('JWT secret key not set in environment variables.');

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        throw new Exception('Invalid JWT: ' . $e->getMessage());
    }
}