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
            $routes->get('update/(:num)', 'DenuncianteController::update/$1');
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
            $routes->post('update/(:num)', 'DenunciadoController::update/$1');
            // Eliminar denunciado
            $routes->delete('delete/(:num)', 'DenunciadoController::delete/$1');
        });

        /*---- DENUNCIAS ----*/
        $routes->group('denuncias', function ($routes) {
            // Buscar denuncia por tracking_code
            $routes->get('codigo/(:alphanum)', 'DenunciaController::query/$1');
            // Listar todas las denuncias
            $routes->get('/', 'DenunciaController::index', ['filter' => 'auth:super_admin,admin']);
            $routes->post('/', 'DenunciaController::create');
            $routes->get('stats', 'AdminsController::getDenunciasStats', ['filter' => 'auth:super_admin,admin']);

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

        // PARA RECIBIR DENUNCIAS ASIGNADAS A UN ADMINISTRADOR
        $routes->post('recibir', 'AdminsController::recibirAdmin', ['filter' => 'auth:super_admin,admin']);

        // PARA VER DENUCNIAS QUE TENGAN DE ESTADO "REGISTRADO"
        $routes->get('registradas', 'AdminsController::getRegistradas', ['filter' => 'auth:super_admin,admin']);
        // PARA VER DENUNCIAS "REGISTRADO" CON PAGINACION
        $routes->get('registradas/(:num)', 'AdminsController::getRegistradas/$1', ['filter' => 'auth:super_admin,admin']);
        // PARA VER DENUNCIAS ACTIVAS (EN PROCESO, PENDIENTE, RECIBIDO)
        $routes->get('activas', 'AdminsController::getDenunciasActivas', ['filter' => 'auth:super_admin,admin']);
        // PARA VER DENUNCIAS ACTIVAS CON PAGINACION
        $routes->get('activas/(:num)', 'AdminsController::getDenunciasActivas/$1', ['filter' => 'auth:super_admin,admin']);

        // PARA CAMBIAR EL ESTADO DE UNA DENUNCIA
        $routes->post('procesos-denuncia', 'AdminsController::procesosDenuncia', ['filter' => 'auth:super_admin,admin']);

        // Gestión de administradores
        $routes->get('/', 'AdminsController::getAdministradores', ['filter' => 'auth:super_admin']); 
        $routes->post('/', 'AdminsController::createAdministrador', ['filter' => 'auth:super_admin']);
        // actualizar administrador por DNI
        $routes->post('update/(:num)', 'AdminsController::updateAdministrador/$1', ['filter' => 'auth:super_admin']);
        // eliminar administrador por dni o id del administrador
        $routes->delete('delete-dni/(:num)', 'AdminsController::deleteAdministrador/$1', ['filter' => 'auth:super_admin']);
        $routes->delete('delete-id/(:num)', 'AdminsController::deleteAdministradorById/$1', ['filter' => 'auth:super_admin']);
        // Buscar Admins por dni o ids
        $routes->get('dni/(:num)', 'AdminsController::searchAdminByDni/$1', ['filter' => 'auth:super_admin']);
        $routes->get('id/(:num)', 'AdminsController::searchAdminById/$1', ['filter' => 'auth:super_admin']);
        // Buscar denuncias por dni o id del denunciante
        $routes->get('buscar-dni/(:num)', 'AdminsController::searchDenuncias/$1', ['filter' => 'auth:super_admin,admin']);
        $routes->get('buscar-id/(:num)', 'AdminsController::searchDenunciasByDenuncianteId/$1', ['filter' => 'auth:super_admin,admin']);
        
        // Buscar denuncias por documento del denunciado
        $routes->get('documento/(:num)', 'AdminsController::searchDenunciaByDocumentoDenunciado/$1', ['filter' => 'auth:super_admin,admin']);
        // Buscar denuncias por nombre del denunciado
        $routes->get('nombre/(:any)', 'AdminsController::searchDenunciaByNombreDenunciado/$1', ['filter' => 'auth:super_admin,admin']);
    });
});
