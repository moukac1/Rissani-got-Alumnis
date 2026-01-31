-- MySQL dump 10.13  Distrib 9.2.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: rissani_connect
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `event_participants`
--

DROP TABLE IF EXISTS `event_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_participants` (
  `event_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  KEY `FKre6m0d4mgt4351tytlkac9jvf` (`user_id`),
  KEY `FK2x391urx4up03f4jp2y9mdt5x` (`event_id`),
  CONSTRAINT `FK2x391urx4up03f4jp2y9mdt5x` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `FKre6m0d4mgt4351tytlkac9jvf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_participants`
--

LOCK TABLES `event_participants` WRITE;
/*!40000 ALTER TABLE `event_participants` DISABLE KEYS */;
INSERT INTO `event_participants` VALUES ('5fb451aa-bce0-44dd-a54d-0fcd644c6807','7bf72017-8a81-4feb-b055-ea136f3076e0'),('5fb451aa-bce0-44dd-a54d-0fcd644c6807','5a341fe9-ca84-41aa-892e-fbde7640c823'),('5fb451aa-bce0-44dd-a54d-0fcd644c6807','ae1917a7-6775-4672-b231-19712218fda5'),('5fb451aa-bce0-44dd-a54d-0fcd644c6807','e8192234-014d-4922-8d96-b18893adbbdc');
/*!40000 ALTER TABLE `event_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` datetime(6) NOT NULL,
  `description` text NOT NULL,
  `lieu` varchar(255) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `type` enum('FORUM','RENCONTRE','AUTRE') NOT NULL,
  `created_by` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmpv90a1lsx9lcxsj7xjcvvsxg` (`created_by`),
  CONSTRAINT `FKmpv90a1lsx9lcxsj7xjcvvsxg` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('5fb451aa-bce0-44dd-a54d-0fcd644c6807','2026-01-29 13:55:28.171089','2028-02-11 22:22:00.000000','lll','a','lll','FORUM','e8192234-014d-4922-8d96-b18893adbbdc');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `annee_bac` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `filiere_bac` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL,
  `sexe` enum('HOMME','FEMME') DEFAULT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `statut` enum('ETUDIANT','EMPLOYE') DEFAULT NULL,
  `num_telephone` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2e9f6aff-9adf-4f9c-9bbf-128f2508f318',NULL,NULL,'2026-01-30 17:42:07.687424','mouad.kacimi@gmail.com',NULL,'kacimi','$2a$10$Wqnj2mg8eaA88ONTsBIQG.DrIMCZ1TLbMuMinME9xlEhTkBIjcV0m','mouad','USER',NULL,NULL,NULL,'0682942853'),('5a341fe9-ca84-41aa-892e-fbde7640c823',2022,NULL,'2026-01-29 16:15:52.813628','mouad.kacimi05@gmail.com','Sciences Mathématiques A','kacimi','$2a$10$Pmj0zc/j1VEkOlRVkO.oxuOA36VQEa.PyBofSHdKLUGkStfaChWvG','mouad','USER','HOMME','informatique','ETUDIANT',''),('67ae9bf5-948c-428b-ac34-2470e341e23b',NULL,NULL,'2026-01-30 18:02:30.394096','mouad@gmail.com',NULL,'kacimi','$2a$10$euw40fQhr1GeK7g73f44BuLuVZfRI0o780yFn3OTzwk3VOEsI.Eeq','mouad','USER',NULL,NULL,NULL,'0682942853'),('7bf72017-8a81-4feb-b055-ea136f3076e0',2022,NULL,'2026-01-28 16:29:56.874840','kuku@gamail.com','Sciences Mathématiques A','kacimi','$2a$10$rjkJlTbUs9w7flN5s376ZOl0iAg/xROoV0aDCyxXivPJp5F40UAWW','mouad','USER','HOMME','info','ETUDIANT',''),('ae1067e9-ee37-4c08-80bc-3116d70fc967',2020,NULL,'2026-01-28 17:01:38.028772','test@example.com','Sciences Mathématiques','Test','$2a$10$kaz7s.A50uCNl.tTi01bK.Dx4kXdD0CbAFxS4OxdfSDq2pVXq7XTi','User','USER','HOMME','Informatique','ETUDIANT',''),('ae1917a7-6775-4672-b231-19712218fda5',2021,NULL,'2026-01-30 18:17:13.406950','kaka@gamail.com','Sciences Mathématiques B','kacimi','$2a$10$EfIwPg6i.V8fWoYGNHFt5.6qBzlTiRIPXnfCr15DSflquXV7JHFZO','mouad','USER','HOMME','0682942853','ETUDIANT','0682942853'),('b8dec5b9-9cc1-412a-9bc0-737ce3591840',2020,NULL,'2026-01-28 17:05:44.009724','test1@example.com','Sciences Mathématiques','Test','$2a$10$vFLCbWnl93Alq7E2KHJ6i.dwOhRItVRbL1YlnOSqQ45.PROWhb8wK','User','USER','HOMME','Informatique','ETUDIANT',''),('e8192234-014d-4922-8d96-b18893adbbdc',NULL,NULL,'2026-01-28 17:13:51.257295','admin@rissani.com',NULL,'Rissani','$2a$10$8cd4STvZCUbBBgQFgUEvYOxtwq3KPj.ABHCOeFMJ5kLdhJW6DX2lO','Admin','ADMIN','HOMME',NULL,'EMPLOYE','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-31 16:46:13
