<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');


/*---- GRUPO DE USUARIOS ----*/
$routes->group('user', function($routes) {

    /*---- ADJUNTOS ----*/
    $routes->group('adjunto', function($routes) {
        // Subir uno o varios archivos a una denuncia
        $routes->post('subir/(:num)', 'Denuncia_consumidor\User\AdjuntoController::subir/$1');
        // Listar todos los archivos de una denuncia
        $routes->get('listar/(:num)', 'Denuncia_consumidor\User\AdjuntoController::listar/$1');
    });

    /*---- DENUNCIANTES ----*/
    $routes->group('denunciante', function($routes) {
        // Listar todos los denunciantes
        $routes->get('/', 'Denuncia_consumidor\User\DenuncianteController::index');
        // Mostrar un denunciante por ID
        $routes->get('show/(:num)', 'Denuncia_consumidor\User\DenuncianteController::show/$1');
        // Crear denunciante (POST JSON)
        $routes->post('/', 'Denuncia_consumidor\User\DenuncianteController::create');
        // Actualizar denunciante
        $routes->put('update/(:num)', 'Denuncia_consumidor\User\DenuncianteController::update/$1');
        // Eliminar denunciante
        $routes->delete('delete/(:num)', 'Denuncia_consumidor\User\DenuncianteController::delete/$1');
    });


    /*---- DENUNCIADOS ----*/
    $routes->group('denunciado', function($routes) {
        // Listar todos los denunciados
        $routes->get('/', 'Denuncia_consumidor\User\DenunciadoController::index');
        // Mostrar un denunciado por ID
        $routes->get('show/(:num)', 'Denuncia_consumidor\User\DenunciadoController::show/$1');
        // Crear denunciado 
        $routes->post('/', 'Denuncia_consumidor\User\DenunciadoController::create');
        // Actualizar denunciado
        $routes->put('update/(:num)', 'Denuncia_consumidor\User\DenunciadoController::update/$1');
        // Eliminar denunciado
        $routes->delete('delete/(:num)', 'Denuncia_consumidor\User\DenunciadoController::delete/$1');
    });

    /*---- DENUNCIAS ----*/
    $routes->group('denuncia', function($routes) {
        // Buscar denuncia por tracking_code
        $routes->get('codigo/(:segment)', 'Denuncia_consumidor\User\DenunciaController::query/$1');
        // Listar todas las denuncias
        $routes->get('/', 'Denuncia_consumidor\User\DenunciaController::index');
        $routes->post('/', 'Denuncia_consumidor\User\DenunciaController::create');

    });

});


$routes->group('seguimiento', function($routes) {
        // Crear seguimiento
        $routes->post('crear', 'Denuncia_consumidor\Seguimiento\SeguimientoDenunciaController::create');
        // Mostrar un denunciante por ID
        $routes->get('(:num)', 'Denuncia_consumidor\Seguimiento\SeguimientoDenunciaController::getByDenunciaId/$1');
});

/*---- GRUPO DE ADMINISTRADORES ----*/

$routes->group('admin', ['namespace' => 'App\Controllers\Denuncia_consumidor\Admin'], function($routes) {

    // Dashboard y gestión de denuncias
    $routes->get('dashboard', 'AdminsController::dashboard');
    $routes->post('receive', 'AdminsController::receiveAdmin');
    $routes->post('procesos-denuncia', 'AdminsController::procesosDenuncia');
    $routes->get('search-denuncias', 'AdminsController::searchDenuncias');

    // Gestión de administradores
    $routes->get('/', 'AdminsController::getAdministradores');
    $routes->post('/', 'AdminsController::createAdministrador');
    $routes->put('update', 'AdminsController::updateAdministrador');
    $routes->get('buscar', 'AdminsController::searchAdmin');
    $routes->get('history', 'AdminsController::historyAdmin');

});






