-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-09-2025 a las 01:07:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `denuncias_consumidor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adjunto`
--

CREATE TABLE `adjunto` (
  `id` int(10) UNSIGNED NOT NULL,
  `denuncia_id` int(10) UNSIGNED NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(100) NOT NULL,
  `estado` enum('1','0') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id`, `nombre`, `dni`, `password`, `rol`, `estado`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TUÑOQUE JULCAS MARTHA LUZ', '40346175', '$2y$10$HP09CHJzqkDyR.OgSQJLNuUbbwCBk.mD6ThhM/XzAUzCSY6nDOJfK', 'super_admin', '1', NULL, '2025-09-02 00:07:47', NULL),
(2, 'MESTA G, LUIS D.', '72357275', '$2y$10$Ul0MFcFpSTIeB2ZVFDan4.rFaWZHucqWGwz/BGKHMzr9q2qTGKSJu', 'super_admin', '1', '2025-09-01 16:54:04', '2025-09-01 16:54:04', NULL),
(3, 'CESPEDES T, PEDRO F.', '60776050', '$2y$10$a7lrRd/bfYfFaDayXqGGG.Cm.uki39Dkxz/Ug0sRtXl3oRry8z23y', 'admin', '1', '2025-09-01 16:54:21', '2025-09-02 00:08:08', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denuncia`
--

CREATE TABLE `denuncia` (
  `id` int(10) UNSIGNED NOT NULL,
  `tracking_code` varchar(20) NOT NULL,
  `denunciante_id` int(10) UNSIGNED DEFAULT NULL,
  `es_anonimo` tinyint(1) NOT NULL,
  `denunciado_id` int(10) UNSIGNED DEFAULT NULL,
  `descripcion` text NOT NULL,
  `estado` varchar(20) NOT NULL,
  `lugar` varchar(100) DEFAULT NULL,
  `fecha_incidente` date NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denunciado`
--

CREATE TABLE `denunciado` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','CE','RUC') DEFAULT NULL,
  `representante_legal` varchar(255) DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `denunciante`
--

CREATE TABLE `denunciante` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `documento` varchar(20) NOT NULL,
  `tipo_documento` enum('DNI','CE','RUC') NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `sexo` enum('M','F') NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_admin`
--

CREATE TABLE `historial_admin` (
  `id` int(10) UNSIGNED NOT NULL,
  `administrador_id` int(10) UNSIGNED NOT NULL,
  `afectado_id` int(10) UNSIGNED NOT NULL,
  `accion` varchar(50) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `version` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `namespace` varchar(255) NOT NULL,
  `time` int(11) NOT NULL,
  `batch` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `version`, `class`, `group`, `namespace`, `time`, `batch`) VALUES
(1, '2025-08-15-034452', 'App\\Database\\Migrations\\CreateTables', 'default', 'App', 1756745147, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_denuncia`
--

CREATE TABLE `seguimiento_denuncia` (
  `id` int(10) UNSIGNED NOT NULL,
  `denuncia_id` int(10) UNSIGNED NOT NULL,
  `administrador_id` int(10) UNSIGNED NOT NULL,
  `comentario` text NOT NULL,
  `estado` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adjunto`
--
ALTER TABLE `adjunto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adjunto_denuncia_id_foreign` (`denuncia_id`);

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `denuncia`
--
ALTER TABLE `denuncia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `denuncia_denunciante_id_foreign` (`denunciante_id`),
  ADD KEY `denuncia_denunciado_id_foreign` (`denunciado_id`);

--
-- Indices de la tabla `denunciado`
--
ALTER TABLE `denunciado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `denunciante`
--
ALTER TABLE `denunciante`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historial_admin_administrador_id_foreign` (`administrador_id`),
  ADD KEY `historial_admin_afectado_id_foreign` (`afectado_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `seguimiento_denuncia`
--
ALTER TABLE `seguimiento_denuncia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seguimiento_denuncia_denuncia_id_foreign` (`denuncia_id`),
  ADD KEY `seguimiento_denuncia_administrador_id_foreign` (`administrador_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adjunto`
--
ALTER TABLE `adjunto`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `denuncia`
--
ALTER TABLE `denuncia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `denunciado`
--
ALTER TABLE `denunciado`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `denunciante`
--
ALTER TABLE `denunciante`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `seguimiento_denuncia`
--
ALTER TABLE `seguimiento_denuncia`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adjunto`
--
ALTER TABLE `adjunto`
  ADD CONSTRAINT `adjunto_denuncia_id_foreign` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `denuncia`
--
ALTER TABLE `denuncia`
  ADD CONSTRAINT `denuncia_denunciado_id_foreign` FOREIGN KEY (`denunciado_id`) REFERENCES `denunciado` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `denuncia_denunciante_id_foreign` FOREIGN KEY (`denunciante_id`) REFERENCES `denunciante` (`id`) ON UPDATE NO ACTION;

--
-- Filtros para la tabla `historial_admin`
--
ALTER TABLE `historial_admin`
  ADD CONSTRAINT `historial_admin_administrador_id_foreign` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `historial_admin_afectado_id_foreign` FOREIGN KEY (`afectado_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Filtros para la tabla `seguimiento_denuncia`
--
ALTER TABLE `seguimiento_denuncia`
  ADD CONSTRAINT `seguimiento_denuncia_administrador_id_foreign` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `seguimiento_denuncia_denuncia_id_foreign` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
