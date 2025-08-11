<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

//Grupo para usuarios
$routes->group('user', function($routes) {
    $routes->get('denuncias', 'DenunciaController::index');
    $routes->post('denuncias', 'DenunciaController::create');

    $routes->get('denunciantes', 'DenuncianteController::index');
    $routes->post('denunciantes', 'DenuncianteController::create');

    $routes->get('denunciados', 'DenunciadoController::index');
    $routes->post('denunciados', 'DenunciadoController::create');

    $routes->get('adjuntos/(:num)', 'User\AdjuntoController::index/$1');
    $routes->post('adjuntos', 'User\AdjuntoController::store');
    $routes->get('adjuntos', 'User\AdjuntoController::store');
});

// Grupo para administradores
$routes->group('admin', function($routes) {
    $routes->get('seguimientos', 'SeguimientoDenunciaController::index');
    $routes->post('seguimientos', 'SeguimientoDenunciaController::create');

    $routes->get('administradores', 'AdministradorController::index');
    $routes->post('administradores', 'AdministradorController::create');

    $routes->get('historial', 'HistorialAdminController::index');
    $routes->get('/', 'Admin\AdministradorController::index');
    $routes->get('(:num)', 'Admin\AdministradorController::show/$1');
    $routes->post('/', 'Admin\AdministradorController::store');
    $routes->put('(:num)', 'Admin\AdministradorController::update/$1');
    $routes->delete('(:num)', 'Admin\AdministradorController::delete/$1');
    $routes->post('login', 'Admin\AdministradorController::login');
    $routes->get('login', 'Admin\AdministradorController::login');
});

// $routes->get('/', 'Home::index');
// $routes->resource('denuncias', ['controller' => 'DenunciaController']);
// $routes->resource('denunciantes', ['controller' => 'DenuncianteController']);
// $routes->resource('denunciados', ['controller' => 'DenunciadoController']);
// $routes->resource('adjuntos', ['controller' => 'User\AdjuntoController']);
// $routes->resource('seguimientos', ['controller' => 'SeguimientoDenunciaController']);
// $routes->resource('administradores', ['controller' => 'AdministradorController']);
// $routes->resource('historial', ['controller' => 'HistorialAdminController']);

