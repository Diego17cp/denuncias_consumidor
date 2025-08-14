<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');


$routes->post('admin/login', 'VerificarAdmi::login');
$routes->get('admin/info', 'VerificarAdmi::getAdminInfo');
$routes->post('admin/logout', 'VerificarAdmi::logout');


/*---- GRUPO DE USUARIOS ----*/
$routes->group('user', function($routes) {

        /*---- ABJUNTOS ----*/
    $routes->group('abjunto', function($routes) {
        // Mostrar un denunciado por ID
        $routes->get('(:num)', 'Denuncia_consumidor\User\AdjuntoController::subir/$1');
        // Crear denunciado 
        $routes->post('subir/(:num)', 'Denuncia_consumidor\User\AdjuntoController::listar/$1');
    });

    /*---- DENUNCIANTES ----*/
    $routes->group('denunciante', function($routes) {
        // Listar todos los denunciantes
        $routes->get('/', 'Denuncia_consumidor\User\DenuncianteController::index');
        // Mostrar un denunciante por ID
        $routes->get('(:num)', 'Denuncia_consumidor\User\DenuncianteController::show/$1');
        // Crear denunciante (POST JSON)
        $routes->post('crear', 'Denuncia_consumidor\User\DenuncianteController::create');
        // Actualizar denunciante
        $routes->put('(:num)', 'Denuncia_consumidor\User\DenuncianteController::update/$1');
        // Eliminar denunciante
        $routes->delete('(:num)', 'Denuncia_consumidor\User\DenuncianteController::delete/$1');
    });


    /*---- DENUNCIADOS ----*/
    $routes->group('denunciado', function($routes) {
        // Listar todos los denunciados
        $routes->get('/', 'Denuncia_consumidor\User\DenunciadoController::index');
        // Mostrar un denunciado por ID
        $routes->get('(:num)', 'Denuncia_consumidor\User\DenunciadoController::show/$1');
        // Crear denunciado 
        $routes->post('crear', 'Denuncia_consumidor\User\DenunciadoController::create');
        // Actualizar denunciado
        $routes->put('(:num)', 'Denuncia_consumidor\User\DenunciadoController::update/$1');
        // Eliminar denunciado
        $routes->delete('(:num)', 'Denuncia_consumidor\User\DenunciadoController::delete/$1');
    });

    /*---- DENUNCIAS ----*/
    $routes->group('denuncia', function($routes) {
        // Buscar denuncia por tracking_code
        $routes->get('codigo/(:segment)', 'Denuncia_consumidor\User\DenunciaController::findByTrackingCode/$1');
        // Listar todas las denuncias
        $routes->get('/', 'Denuncia_consumidor\User\DenunciaController::index');
        $routes->get('crear', 'Denuncia_consumidor\User\DenunciaController::create');

    });

});


$routes->group('seguimiento', function($routes) {

        $routes->get('crear', 'Denuncia_consumidor\Seguimiento\SeguimientoDenunciaController::create');
        // Mostrar un denunciante por ID
        $routes->post('(:num)', 'Denuncia_consumidor\Seguimiento\SeguimientoDenunciaController::getByDenunciaId/$1');
});

// Grupo para administradores
$routes->group('admin', function($routes) {

    $routes->get('dashboard', 'Denuncias_consumidor\Admin\AdminController::dashboard');
    $routes->post('recibir-denuncia', 'Denuncias_consumidor\Admin\AdminController::receiveAdmin');
    $routes->post('procesar-denuncia', 'Denuncias_consumidor\Admin\AdminController::procesosDenuncia');
    $routes->get('buscar-denuncia', 'Denuncias_consumidor\Admin\AdminController::search');
});

$routes->group('superadmin', function($routes) {
    $routes->get('/', 'Denuncias_consumidor\Admin\SuperAdminController::getAdministradores');
    $routes->post('crear', 'Denuncias_consumidor\Admin\SuperAdminController::createAdministrador');
    $routes->put('actualizar', 'Denuncias_consumidor\Admin\SuperAdminController::updateAdministrador');
    $routes->get('buscar', 'Denuncias_consumidor\Admin\SuperAdminController::searchAdmin');
    $routes->get('historial', 'Denuncias_consumidor\Admin\SuperAdminController::historyAdmin');
});



