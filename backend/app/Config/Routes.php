<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->group('/', [
    'filter'    => 'cors',
    'namespace' => 'App\Controllers\DenunciasConsumidor\v1'
], function ($routes) {
    /*------ CORS ------ */
    $routes->options('(:any)', static function () {});

    /*---- RUTAS DE AUTENTICACION ----*/
    $routes->post('login', 'AuthController::login');    
    $routes->post('logout', 'AuthController::logout');
    $routes->get('refresh', 'AuthController::refresh');
    
        /*---- DENUNCIANTES ----*/
        $routes->group('denunciante', function ($routes) {
            // Listar todos los denunciantes
            $routes->get('/', 'DenuncianteController::index');
            // Mostrar un denunciante por ID
            $routes->get('show/(:num)', 'DenuncianteController::show/$1');
            // Crear denunciante (POST JSON)
            $routes->post('/', 'DenuncianteController::create');
            // Actualizar denunciante
            $routes->put('update/(:num)', 'DenuncianteController::update/$1');
            // Eliminar denunciante
            $routes->delete('delete/(:num)', 'DenuncianteController::delete/$1');
        });


        /*---- DENUNCIADOS ----*/
        $routes->group('denunciado', function ($routes) {
            // Listar todos los denunciados
            $routes->get('/', 'DenunciadoController::index');
            // Mostrar un denunciado por ID
            $routes->get('show/(:num)', 'DenunciadoController::show/$1');
            // Crear denunciado
            $routes->post('/', 'DenunciadoController::create');
            // Actualizar denunciado
            $routes->put('update/(:num)', 'DenunciadoController::update/$1');
            // Eliminar denunciado
            $routes->delete('delete/(:num)', 'DenunciadoController::delete/$1');
        });

        /*---- DENUNCIAS ----*/
        $routes->group('denuncias', function ($routes) {
            // Buscar denuncia por tracking_code
            $routes->get('codigo/(:alphanum)', 'DenunciaController::query/$1');
            // Listar todas las denuncias
            $routes->get('/', 'DenunciaController::index');
            $routes->post('/', 'DenunciaController::create');

            /*---- ADJUNTOS ----*/
            $routes->group('adjunto', function ($routes) {
                // Subir adjuntos junto con la denuncia (form-data)
                $routes->post('subir/(:num)', 'AdjuntoController::subirAdjuntos/$1');
                // Descargar todos los adjuntos en ZIP
                $routes->get('descargar/(:num)', 'AdjuntoController::descargarAdjuntos/$1');
            });
        });

    $routes->group('seguimiento', function ($routes) {
        // Crear seguimiento
        $routes->post('/', 'SeguimientoDenunciaController::create');
        // Buscar seguimientos por ID de denuncia
        $routes->get('show/(:num)', 'SeguimientoDenunciaController::getByDenunciaId/$1');
    });

    $routes->get('dni/(:num)', 'Api::buscarDNI/$1');
    $routes->get('ruc/(:num)', 'Api::buscarRUC/$1');

    /*---- GRUPO DE ADMINISTRADORES ----*/

    $routes->group('admin', function ($routes) {

        // Dashboard y gestión de denuncias
        //$routes->get('dashboard', 'AdminsController::dashboard');
        $routes->post('recibir', 'AdminsController::recibirAdmin');
        $routes->get('registradas', 'AdminsController::getRegistradas');
        $routes->get('activas', 'AdminsController::getDenunciasActivas');
        $routes->post('procesos-denuncia', 'AdminsController::procesosDenuncia');

        // Gestión de administradores
        $routes->get('/', 'AdminsController::getAdministradores'); 
        $routes->post('/', 'AdminsController::createAdministrador', ['filter' => 'auth:super_admin']);
        // actualizar administrador por DNI
        $routes->put('update/(:num)', 'AdminsController::updateAdministrador/$1');
        // eliminar administrador por dni o id del administrador
        $routes->delete('delete-dni/(:num)', 'AdminsController::deleteAdministrador/$1');
        $routes->delete('delete-id/(:num)', 'AdminsController::deleteAdministradorById/$1');
        // Buscar Admins por dni o ids
        $routes->get('dni/(:num)', 'AdminsController::searchAdminByDni/$1');
        $routes->get('id/(:num)', 'AdminsController::searchAdminById/$1');
        // Buscar denuncias por dni o id del denunciante
        $routes->get('buscar-dni/(:num)', 'AdminsController::searchDenuncias/$1');
        $routes->get('buscar-id/(:num)', 'AdminsController::searchDenunciasByDenuncianteId/$1');  
    });
});
