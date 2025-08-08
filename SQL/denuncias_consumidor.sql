-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: denuncias_consumidor
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adjunto`
--

DROP TABLE IF EXISTS `adjunto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adjunto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `denuncia_id` int DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(100) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `fecha_subida` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `denuncia_id` (`denuncia_id`),
  CONSTRAINT `adjunto_ibfk_1` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adjunto`
--

LOCK TABLES `adjunto` WRITE;
/*!40000 ALTER TABLE `adjunto` DISABLE KEYS */;
/*!40000 ALTER TABLE `adjunto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(255) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denuncia`
--

DROP TABLE IF EXISTS `denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denuncia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tracking_code` varchar(20) DEFAULT NULL,
  `es_anonimo` tinyint(1) DEFAULT NULL,
  `denunciante_id` int DEFAULT NULL,
  `motivo_otro` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `fecha_incidente` date DEFAULT NULL,
  `denunciado_id` int DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `estado` enum('registrado','revision','en_proceso','resuelto','rechazado') DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `denunciante_id` (`denunciante_id`),
  KEY `denunciado_id` (`denunciado_id`),
  CONSTRAINT `denuncia_ibfk_1` FOREIGN KEY (`denunciante_id`) REFERENCES `denunciante` (`id`),
  CONSTRAINT `denuncia_ibfk_3` FOREIGN KEY (`denunciado_id`) REFERENCES `denunciado` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denuncia`
--

LOCK TABLES `denuncia` WRITE;
/*!40000 ALTER TABLE `denuncia` DISABLE KEYS */;
/*!40000 ALTER TABLE `denuncia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denunciado`
--

DROP TABLE IF EXISTS `denunciado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denunciado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `tipo_documento` enum('DNI','CEDULA','RUC') DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denunciado`
--

LOCK TABLES `denunciado` WRITE;
/*!40000 ALTER TABLE `denunciado` DISABLE KEYS */;
/*!40000 ALTER TABLE `denunciado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `denunciante`
--

DROP TABLE IF EXISTS `denunciante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `denunciante` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(90) DEFAULT NULL,
  `numero_documento` varchar(20) DEFAULT NULL,
  `tipo_documento` enum('DNI','CEDULA','RUC') DEFAULT NULL,
  `razon_social` varchar(255) DEFAULT NULL,
  `sexo` enum('M','F') DEFAULT NULL,
  `distrito` varchar(100) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `departamento` varchar(100) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `denunciante`
--

LOCK TABLES `denunciante` WRITE;
/*!40000 ALTER TABLE `denunciante` DISABLE KEYS */;
/*!40000 ALTER TABLE `denunciante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_admin`
--

DROP TABLE IF EXISTS `historial_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `solicitado_por` varchar(8) DEFAULT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `accion` varchar(50) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `fecha_accion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `historial_admin_ibfk_1` FOREIGN KEY (`id`) REFERENCES `administrador` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_admin`
--

LOCK TABLES `historial_admin` WRITE;
/*!40000 ALTER TABLE `historial_admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `historial_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento_denuncia`
--

DROP TABLE IF EXISTS `seguimiento_denuncia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento_denuncia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `denuncia_id` int DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `comentario` text,
  `fecha_actualizacion` datetime DEFAULT NULL,
  `administrador_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `denuncia_id` (`denuncia_id`),
  KEY `administrador_id` (`administrador_id`),
  CONSTRAINT `seguimiento_denuncia_ibfk_1` FOREIGN KEY (`denuncia_id`) REFERENCES `denuncia` (`id`),
  CONSTRAINT `seguimiento_denuncia_ibfk_2` FOREIGN KEY (`administrador_id`) REFERENCES `administrador` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento_denuncia`
--

LOCK TABLES `seguimiento_denuncia` WRITE;
/*!40000 ALTER TABLE `seguimiento_denuncia` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguimiento_denuncia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-08 12:32:07
