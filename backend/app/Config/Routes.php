<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->resource('denuncias', ['controller' => 'DenunciaController']);
$routes->resource('denunciantes', ['controller' => 'DenuncianteController']);
$routes->resource('denunciados', ['controller' => 'DenunciadoController']);
$routes->resource('adjuntos', ['controller' => 'AdjuntoController']);
$routes->resource('seguimientos', ['controller' => 'SeguimientoDenunciaController']);
$routes->resource('administradores', ['controller' => 'AdministradorController']);
$routes->resource('historial', ['controller' => 'HistorialAdminController']);

