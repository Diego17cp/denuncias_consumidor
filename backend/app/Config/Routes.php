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
    
    /*---- GRUPO DE USUARIOS ----*/
    $routes->group('user', function ($routes) {

        /*---- ADJUNTOS ----*/
        $routes->group('adjunto', function ($routes) {
            // Subir uno o varios archivos a una denuncia
            $routes->post('subir/(:num)', 'AdjuntoController::subir/$1');
            // Listar todos los archivos de una denuncia
            $routes->get('listar/(:num)', 'AdjuntoController::listar/$1');
        });

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
        $routes->group('denuncia', function ($routes) {
            // Buscar denuncia por tracking_code
            $routes->get('codigo/(:alphanum)', 'DenunciaController::query/$1');
            // Listar todas las denuncias
            $routes->get('/', 'DenunciaController::index');
            $routes->post('/', 'DenunciaController::create');
        });
    });

    $routes->group('seguimiento', function ($routes) {
        // Crear seguimiento
        $routes->post('crear', 'SeguimientoDenunciaController::create');
        // Mostrar un denunciante por ID
        $routes->get('(:num)', 'SeguimientoDenunciaController::getByDenunciaId/$1');
    });

    $routes->group('api', function ($routes) {
        $routes->get('dni/(:num)', 'Api::buscarDNI/$1');
        $routes->get('ruc/(:num)', 'Api::buscarRUC/$1');
    });

    /*---- GRUPO DE ADMINISTRADORES ----*/

    $routes->group('admin', function ($routes) {

        // Dashboard y gestión de denuncias
        //$routes->get('dashboard', 'AdminsController::dashboard');
        $routes->post('recibir', 'AdminsController::receiveAdmin');
        $routes->post('procesos-denuncia', 'AdminsController::procesosDenuncia');
        $routes->get('buscar-denuncias', 'AdminsController::searchDenuncias');

        // Gestión de administradores
        $routes->get('/', 'AdminsController::getAdministradores');
        $routes->post('/', 'AdminsController::createAdministrador');
        $routes->put('update', 'AdminsController::updateAdministrador');
        $routes->get('buscar', 'AdminsController::searchAdmin');
        $routes->get('buscar/(:num)', 'AdminsController::searchDenunciasByDenuncianteId/$1');
        $routes->get('probar-correo', 'AdminsController::probarCorreo');
        //$routes->get('history', 'AdminsController::historyAdmin');

    });
});
