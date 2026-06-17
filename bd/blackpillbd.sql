SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Banco de dados: `blackpillbd`

-- --------------------------------------------------------

CREATE TABLE `usuario` (
  `id_user` CHAR(36) NOT NULL,
  `nome` VARCHAR(256) NOT NULL,
  `email` VARCHAR(256) NOT NULL,
  `senha` VARCHAR(256) NOT NULL,
  
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `ficha_med` (
  `id_ficha_med` CHAR(36) NOT NULL,
  `id_user` CHAR(36) NOT NULL,
  `altura` DECIMAL(5,2) DEFAULT NULL,
  `peso` DECIMAL(5,2) DEFAULT NULL,
  `sexo` CHAR(1) DEFAULT NULL,
  `data_nascimento` DATE DEFAULT NULL,

  PRIMARY KEY (`id_ficha_med`),
  UNIQUE KEY `unique_usuario` (`id_user`),
  CONSTRAINT `FK_ficha_usuario` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

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
  `numb_exp_bula_vigen` varchar(50) DEFAULT NULL,

  PRIMARY KEY (`id_bula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

CREATE TABLE `remedio` (
  `cd_remedio` CHAR(36) NOT NULL,
  `fk_bula_id_bula` CHAR(36) DEFAULT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `fabricante` VARCHAR(100) DEFAULT NULL,
  `marca` VARCHAR(100) DEFAULT NULL,
  `concentracao` VARCHAR(50) DEFAULT NULL,
  `tarja` VARCHAR(50) DEFAULT NULL,
  `dcb` VARCHAR(100) DEFAULT NULL,

  PRIMARY KEY (`cd_remedio`),
  CONSTRAINT `FK_remedio_bula` FOREIGN KEY (`fk_bula_id_bula`) REFERENCES `bula` (`id_bula`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `tratamento` (
  `id_tratamento` CHAR(36) NOT NULL,
  `fk_usuario_id_user` CHAR(36) NOT NULL,
  `nome_tratamento` VARCHAR(100) DEFAULT 'Meu Tratamento',
  `data_inicio` DATE NOT NULL,
  `data_fim` DATE DEFAULT NULL,
  `status_ativo` BOOLEAN DEFAULT TRUE,

  PRIMARY KEY (`id_tratamento`),
  CONSTRAINT `FK_tratamento_usuario` FOREIGN KEY (`fk_usuario_id_user`) REFERENCES `usuario` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `tratamento_remedio` (
  `fk_tratamento_id` CHAR(36) NOT NULL,
  `fk_remedio_cd_remedio` CHAR(36) NOT NULL,
  `dose` VARCHAR(50) NOT NULL,

  PRIMARY KEY (`fk_tratamento_id`, `fk_remedio_cd_remedio`),
  CONSTRAINT `FK_int_tratamento` FOREIGN KEY (`fk_tratamento_id`) REFERENCES `tratamento` (`id_tratamento`) ON DELETE CASCADE,
  CONSTRAINT `FK_int_remedio` FOREIGN KEY (`fk_remedio_cd_remedio`) REFERENCES `remedio` (`cd_remedio`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

CREATE TABLE `horario_tratamento` (
  `id_horario` CHAR(36) NOT NULL,
  `fk_id_tratamento` CHAR(36) NOT NULL,
  `horario` TIME NOT NULL,

  PRIMARY KEY (`id_horario`),
  CONSTRAINT `FK_disparo_tratamento` FOREIGN KEY (`fk_id_tratamento`) REFERENCES `tratamento` (`id_tratamento`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;

-- --------------------------------------------------------