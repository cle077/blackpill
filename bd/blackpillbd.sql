-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 29/04/2026 às 20:27
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `blackpillbd`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `bula`
--

CREATE TABLE `bula` (
  `id_bula` char(36) NOT NULL,
  `indicacao` text DEFAULT NULL,
  `cont_indicacao` text DEFAULT NULL,
  `posologia` text DEFAULT NULL,
  `reacao_adversa` text DEFAULT NULL,
  `forma_farmaceutica` varchar(100) DEFAULT NULL,
  `composicao` text DEFAULT NULL,
  `advertencia` text DEFAULT NULL,
  `superdose` text DEFAULT NULL,
  `intera_medi` text DEFAULT NULL,
  `numb_exp_bula_vigen` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `controle_med`
--

CREATE TABLE `controle_med` (
  `id_controle_med` char(36) NOT NULL,
  `med_usados` varchar(255) DEFAULT NULL,
  `tratamento_ativo` varchar(50) DEFAULT NULL,
  `hora_med` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ficha_med`
--

CREATE TABLE `ficha_med` (
  `altura` decimal(5,2) DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `idade` date DEFAULT NULL,
  `id_user` char(36) NOT NULL,
  `id_ficha_med` char(36) NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `fk_controle_med_id_controle_med` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `remedio`
--

CREATE TABLE `remedio` (
  `fk_bula_id_bula` char(36) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `concentracao` varchar(50) DEFAULT NULL,
  `quant_de_dose` varchar(50) DEFAULT NULL,
  `tarja` varchar(50) DEFAULT NULL,
  `cd_remedio` char(36) NOT NULL,
  `dcb` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `sistem_alert`
--

CREATE TABLE `sistem_alert` (
  `lembretes` varchar(255) DEFAULT NULL,
  `calend_trata` date DEFAULT NULL,
  `id_sistem_med` char(36) NOT NULL,
  `fk_ficha_med_id_user` char(36) DEFAULT NULL,
  `fk_ficha_med_id_ficha_med` char(36) DEFAULT NULL,
  `fk_usuario_id_user` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_user` varchar(36) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `senha` varchar(100) DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fk_ficha_med_id_user` char(36) DEFAULT NULL,
  `fk_ficha_med_id_ficha_med` char(36) DEFAULT NULL,
  `fk_remedio_cd_remedio` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `bula`
--
ALTER TABLE `bula`
  ADD PRIMARY KEY (`id_bula`);

--
-- Índices de tabela `controle_med`
--
ALTER TABLE `controle_med`
  ADD PRIMARY KEY (`id_controle_med`);

--
-- Índices de tabela `ficha_med`
--
ALTER TABLE `ficha_med`
  ADD PRIMARY KEY (`id_user`,`id_ficha_med`),
  ADD UNIQUE KEY `id_ficha_med` (`id_ficha_med`,`id_user`),
  ADD KEY `FK_ficha_med_2` (`fk_controle_med_id_controle_med`);

--
-- Índices de tabela `remedio`
--
ALTER TABLE `remedio`
  ADD PRIMARY KEY (`cd_remedio`),
  ADD KEY `FK_remedio_1` (`fk_bula_id_bula`);

--
-- Índices de tabela `sistem_alert`
--
ALTER TABLE `sistem_alert`
  ADD PRIMARY KEY (`id_sistem_med`),
  ADD KEY `FK_sistem_alert_2` (`fk_ficha_med_id_user`,`fk_ficha_med_id_ficha_med`),
  ADD KEY `FK_sistem_alert_3` (`fk_usuario_id_user`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `FK_usuario_2` (`fk_ficha_med_id_user`,`fk_ficha_med_id_ficha_med`),
  ADD KEY `FK_usuario_3` (`fk_remedio_cd_remedio`);

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `ficha_med`
--
ALTER TABLE `ficha_med`
  ADD CONSTRAINT `FK_ficha_med_2` FOREIGN KEY (`fk_controle_med_id_controle_med`) REFERENCES `controle_med` (`id_controle_med`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ficha_med_4` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_user`);

--
-- Restrições para tabelas `remedio`
--
ALTER TABLE `remedio`
  ADD CONSTRAINT `FK_remedio_1` FOREIGN KEY (`fk_bula_id_bula`) REFERENCES `bula` (`id_bula`) ON DELETE CASCADE;

--
-- Restrições para tabelas `sistem_alert`
--
ALTER TABLE `sistem_alert`
  ADD CONSTRAINT `FK_sistem_alert_2` FOREIGN KEY (`fk_ficha_med_id_user`,`fk_ficha_med_id_ficha_med`) REFERENCES `ficha_med` (`id_user`, `id_ficha_med`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_sistem_alert_3` FOREIGN KEY (`fk_usuario_id_user`) REFERENCES `usuario` (`id_user`) ON DELETE SET NULL;

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `FK_usuario_2` FOREIGN KEY (`fk_ficha_med_id_user`,`fk_ficha_med_id_ficha_med`) REFERENCES `ficha_med` (`id_user`, `id_ficha_med`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_usuario_3` FOREIGN KEY (`fk_remedio_cd_remedio`) REFERENCES `remedio` (`cd_remedio`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
