-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/06/2026 às 18:55
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
  `numb_exp_bula_vigen` varchar(50) DEFAULT NULL,
  `bula_resumida` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `bula`
--

INSERT INTO `bula` (`id_bula`, `indicacao`, `cont_indicacao`, `posologia`, `reacao_adversa`, `forma_farmaceutica`, `composicao`, `advertencia`, `superdose`, `intera_medi`, `numb_exp_bula_vigen`, `bula_resumida`) VALUES
('1127188a-7b80-4b8c-a6dd-92eaad2ad0de', 'Dor e inflamação', 'Anti-inflamatório', '400mg a cada 8h', 'Azia', 'Comprimido', 'Ibuprofeno 400mg', 'Evitar úlcera', 'Risco renal', 'Anticoagulantes', 'EXP-002', 'Para que serve: alivia dor e reduz inflamação.\n\nComo usar: normalmente 400mg a cada 8 horas.\n\nCuidados: pode agravar úlceras no estômago — evite uso prolongado sem orientação médica. Se usar junto com anticoagulantes, avise seu médico, pois pode aumentar o risco de sangramento. Em doses muito altas, pode afetar os rins.\n\nEfeitos colaterais comuns: azia.'),
('4df1a8c6-e73f-4b12-ae2e-b35710a735a6', 'Colesterol', 'Redução do LDL', '20mg à noite', 'Dor muscular', 'Comprimido', 'Sinvastatina 20mg', 'Monitorar fígado', 'Rabdomiólise', 'Grapefruit', 'EXP-009', 'Para que serve: reduz o colesterol (LDL, o \'colesterol ruim\').\n\nComo usar: 20mg à noite.\n\nCuidados: o uso deve ser acompanhado de exames periódicos do fígado. Evite consumir grapefruit (toranja), pois pode aumentar os efeitos do remédio de forma perigosa. Dor muscular intensa pode ser sinal de um problema raro, mas grave — procure um médico se isso acontecer.\n\nEfeitos colaterais comuns: dor muscular leve.'),
('64c68216-0791-4f27-a764-48f7d74615de', 'Infecções', 'Antibiótico macrolídeo', '500mg/dia', 'Dor abdominal', 'Comprimido', 'Azitromicina 500mg', 'Uso sob prescrição', 'Arritmias', 'Antiácidos', 'EXP-005', 'Para que serve: trata infecções bacterianas, geralmente respiratórias.\n\nComo usar: 500mg por dia, sempre com prescrição médica.\n\nCuidados: não tome junto com antiácidos sem orientação, pois pode reduzir o efeito do remédio. Em doses muito altas, pode afetar o ritmo do coração.\n\nEfeitos colaterais comuns: dor abdominal.'),
('75a7cb67-0352-46ac-bfe9-2b6b43ded93e', 'Alergias', 'Anti-histamínico', '10mg/dia', 'Sonolência leve', 'Comprimido', 'Loratadina 10mg', 'Evitar álcool', 'Sedação', 'Sedativos', 'EXP-010', 'Para que serve: alivia sintomas de alergia, como coceira e coriza.\n\nComo usar: 10mg por dia.\n\nCuidados: evite consumir álcool junto, e tenha cuidado ao combinar com outros sedativos, pois pode aumentar a sonolência.\n\nEfeitos colaterais comuns: sonolência leve.'),
('7a1fbcd0-4f0d-4c55-ba64-95770b910a49', 'Hipertensão', 'Controle da pressão', '50mg/dia', 'Tontura', 'Comprimido', 'Losartana 50mg', 'Monitorar pressão', 'Hipotensão', 'Diuréticos', 'EXP-008', 'Para que serve: controla a pressão alta.\n\nComo usar: 50mg por dia.\n\nCuidados: monitore sua pressão regularmente. Usar junto com diuréticos pode intensificar a queda de pressão, então fique atento.\n\nEfeitos colaterais comuns: tontura.'),
('7f9087c3-ca57-4a15-a702-ac3e501c6866', 'Dor e febre', 'Alívio de dores e febre', '500mg a cada 6h', 'Náusea', 'Comprimido', 'Paracetamol 500mg', 'Não exceder a dose', 'Risco hepático', 'Álcool', 'EXP-001', 'Para que serve: alivia dor e baixa a febre.\n\nComo usar: geralmente 500mg a cada 6 horas, sempre seguindo a orientação médica.\n\nCuidados: não tome mais do que a dose recomendada — em excesso, pode prejudicar o fígado. Evite consumir junto com bebida alcoólica.\n\nEfeitos colaterais comuns: pode causar náusea em algumas pessoas.'),
('9a51a5bd-6b87-4fae-a14b-83c6289dd172', 'Dor e febre', 'Analgésico e antitérmico', '500mg a 1g', 'Queda de pressão', 'Comprimido', 'Dipirona 500mg', 'Atenção alergias', 'Intoxicação', 'Álcool', 'EXP-003', 'Para que serve: alivia dor e baixa febre.\n\nComo usar: de 500mg a 1g, conforme orientação médica.\n\nCuidados: fique atento a sinais de alergia, pois a dipirona pode causar reações alérgicas em algumas pessoas. Evite consumir com álcool. Em doses muito altas, pode causar intoxicação.\n\nEfeitos colaterais comuns: queda de pressão arterial.'),
('a30c8cc7-3ed9-484e-9c02-a492950df768', 'Infecções', 'Antibiótico', '500mg a cada 8h', 'Diarreia', 'Cápsula', 'Amoxicilina 500mg', 'Completar tratamento', 'Sintomas GI', 'Anticoagulantes', 'EXP-004', 'Para que serve: trata infecções causadas por bactérias.\n\nComo usar: 500mg a cada 8 horas — é fundamental completar o tratamento até o fim, mesmo que os sintomas melhorem antes.\n\nCuidados: pode interagir com anticoagulantes, então avise seu médico se estiver usando esse tipo de remédio.\n\nEfeitos colaterais comuns: diarreia.'),
('bd5f7dc3-1d28-4ed5-860e-c614b0716a37', 'Diabetes tipo 2', 'Controle glicêmico', '850mg 2x/dia', 'Diarreia', 'Comprimido', 'Metformina 850mg', 'Cautela renal', 'Acidose láctica', 'Álcool', 'EXP-007', 'Para que serve: ajuda a controlar o açúcar no sangue em pessoas com diabetes tipo 2.\n\nComo usar: 850mg, duas vezes ao dia.\n\nCuidados: pessoas com problemas nos rins devem usar com cautela e acompanhamento médico. Evite consumir álcool em excesso, pois aumenta o risco de uma complicação grave chamada acidose láctica.\n\nEfeitos colaterais comuns: diarreia.'),
('e47486e5-d09d-4630-89ec-994aa498cdd6', 'Refluxo', 'Redução do ácido gástrico', '20mg/dia', 'Cefaleia', 'Cápsula', 'Omeprazol 20mg', 'Uso prolongado com cautela', 'Confusão', 'Clopidogrel', 'EXP-006', 'Para que serve: reduz a produção de ácido no estômago, aliviando refluxo e azia.\n\nComo usar: 20mg por dia.\n\nCuidados: o uso prolongado deve ser acompanhado por um médico. Pode interagir com o clopidogrel (remédio para o coração), reduzindo o efeito dele.\n\nEfeitos colaterais comuns: dor de cabeça.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `ficha_med`
--

CREATE TABLE `ficha_med` (
  `id_ficha_med` char(36) NOT NULL,
  `id_user` char(36) NOT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `horario_tratamento`
--

CREATE TABLE `horario_tratamento` (
  `id_horario` char(36) NOT NULL,
  `fk_id_tratamento` char(36) NOT NULL,
  `horario` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `remedio`
--

CREATE TABLE `remedio` (
  `cd_remedio` char(36) NOT NULL,
  `fk_bula_id_bula` char(36) DEFAULT NULL,
  `nome` varchar(100) NOT NULL,
  `fabricante` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `concentracao` varchar(50) DEFAULT NULL,
  `tarja` varchar(50) DEFAULT NULL,
  `dcb` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `remedio`
--

INSERT INTO `remedio` (`cd_remedio`, `fk_bula_id_bula`, `nome`, `fabricante`, `marca`, `concentracao`, `tarja`, `dcb`) VALUES
('09a74189-0c2a-4200-b3ca-e69129504b78', '9a51a5bd-6b87-4fae-a14b-83c6289dd172', 'Dipirona', 'Sanofi', 'Novalgina', '500mg', 'Vermelha', 'Dipirona Sódica'),
('226f52b9-9c61-4484-857e-ebbc16885ab2', '7f9087c3-ca57-4a15-a702-ac3e501c6866', 'Paracetamol', 'Janssen-Cilag', 'Tylenol', '500mg', 'Sem tarja', 'Paracetamol'),
('2ba00a04-14c3-4c4d-b706-6c1d79a59160', '1127188a-7b80-4b8c-a6dd-92eaad2ad0de', 'Ibuprofeno', 'Hypera Pharma', 'Alivium', '400mg', 'Vermelha', 'Ibuprofeno'),
('6bc4ad79-317a-4d72-bf33-81d14d7cd31a', 'e47486e5-d09d-4630-89ec-994aa498cdd6', 'Omeprazol', 'AstraZeneca', 'Losec', '20mg', 'Sem tarja', 'Omeprazol'),
('a0fbdd49-a41f-4b6c-86f6-7291d7a7eee8', '64c68216-0791-4f27-a764-48f7d74615de', 'Azitromicina', 'Pfizer', 'Zitromax', '500mg', 'Vermelha', 'Azitromicina Dihidratada'),
('b60413dc-5b5b-4d90-ae9d-f8766c876251', '7a1fbcd0-4f0d-4c55-ba64-95770b910a49', 'Losartana', 'Merck', 'Cozaar', '50mg', 'Vermelha', 'Losartana Potássica'),
('ba8566ff-2444-4ae6-bf02-55299f3e61cf', 'a30c8cc7-3ed9-484e-9c02-a492950df768', 'Amoxicilina', 'GSK', 'Amoxil', '500mg', 'Vermelha', 'Amoxicilina Tri-hidratada'),
('cd1affa4-4ff6-461b-a953-1a92365329a7', '4df1a8c6-e73f-4b12-ae2e-b35710a735a6', 'Sinvastatina', 'Merck', 'Zocor', '20mg', 'Vermelha', 'Sinvastatina'),
('ee9d470f-5798-4e2e-8568-60855a6fb9f7', 'bd5f7dc3-1d28-4ed5-860e-c614b0716a37', 'Metformina', 'Merck', 'Glifage', '850mg', 'Vermelha', 'Cloridrato de Metformina'),
('f5e2f831-8b4c-4504-ab75-84ac4a30490d', '75a7cb67-0352-46ac-bfe9-2b6b43ded93e', 'Loratadina', 'Bayer', 'Claritin', '10mg', 'Sem tarja', 'Loratadina');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tratamento`
--

CREATE TABLE `tratamento` (
  `id_tratamento` char(36) NOT NULL,
  `fk_usuario_id_user` char(36) NOT NULL,
  `nome_tratamento` varchar(100) DEFAULT 'Meu Tratamento',
  `data_inicio` date NOT NULL,
  `data_fim` date DEFAULT NULL,
  `status_ativo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tratamento_remedio`
--

CREATE TABLE `tratamento_remedio` (
  `fk_tratamento_id` char(36) NOT NULL,
  `fk_remedio_cd_remedio` char(36) NOT NULL,
  `dose` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_user` char(36) NOT NULL,
  `nome` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `senha` varchar(256) NOT NULL
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
-- Índices de tabela `ficha_med`
--
ALTER TABLE `ficha_med`
  ADD PRIMARY KEY (`id_ficha_med`),
  ADD UNIQUE KEY `unique_usuario` (`id_user`);

--
-- Índices de tabela `horario_tratamento`
--
ALTER TABLE `horario_tratamento`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `FK_disparo_tratamento` (`fk_id_tratamento`);

--
-- Índices de tabela `remedio`
--
ALTER TABLE `remedio`
  ADD PRIMARY KEY (`cd_remedio`),
  ADD KEY `FK_remedio_bula` (`fk_bula_id_bula`);

--
-- Índices de tabela `tratamento`
--
ALTER TABLE `tratamento`
  ADD PRIMARY KEY (`id_tratamento`),
  ADD KEY `FK_tratamento_usuario` (`fk_usuario_id_user`);

--
-- Índices de tabela `tratamento_remedio`
--
ALTER TABLE `tratamento_remedio`
  ADD PRIMARY KEY (`fk_tratamento_id`,`fk_remedio_cd_remedio`),
  ADD KEY `FK_int_remedio` (`fk_remedio_cd_remedio`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `ficha_med`
--
ALTER TABLE `ficha_med`
  ADD CONSTRAINT `FK_ficha_usuario` FOREIGN KEY (`id_user`) REFERENCES `usuario` (`id_user`) ON DELETE CASCADE;

--
-- Restrições para tabelas `horario_tratamento`
--
ALTER TABLE `horario_tratamento`
  ADD CONSTRAINT `FK_disparo_tratamento` FOREIGN KEY (`fk_id_tratamento`) REFERENCES `tratamento` (`id_tratamento`) ON DELETE CASCADE;

--
-- Restrições para tabelas `remedio`
--
ALTER TABLE `remedio`
  ADD CONSTRAINT `FK_remedio_bula` FOREIGN KEY (`fk_bula_id_bula`) REFERENCES `bula` (`id_bula`) ON DELETE SET NULL;

--
-- Restrições para tabelas `tratamento`
--
ALTER TABLE `tratamento`
  ADD CONSTRAINT `FK_tratamento_usuario` FOREIGN KEY (`fk_usuario_id_user`) REFERENCES `usuario` (`id_user`) ON DELETE CASCADE;

--
-- Restrições para tabelas `tratamento_remedio`
--
ALTER TABLE `tratamento_remedio`
  ADD CONSTRAINT `FK_int_remedio` FOREIGN KEY (`fk_remedio_cd_remedio`) REFERENCES `remedio` (`cd_remedio`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_int_tratamento` FOREIGN KEY (`fk_tratamento_id`) REFERENCES `tratamento` (`id_tratamento`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
