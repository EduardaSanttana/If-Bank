CREATE DATABASE IF NOT EXISTS ifbank;
USE ifbank;

-- =====================================================
-- USUARIO
-- =====================================================

CREATE TABLE usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(60) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,

    endereco VARCHAR(200),
    telefone VARCHAR(20),

    email VARCHAR(100) NOT NULL UNIQUE,

    senha_hash VARCHAR(255) NOT NULL,

    foto VARCHAR(255),

    perfil ENUM('CLIENTE','GERENTE') NOT NULL DEFAULT 'CLIENTE',

    status ENUM('PENDENTE','APROVADO')
        NOT NULL DEFAULT 'PENDENTE'
);

-- =====================================================
-- CONTA
-- =====================================================

CREATE TABLE conta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    numero_conta VARCHAR(20) NOT NULL UNIQUE,

    saldo DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    usuario_id BIGINT NOT NULL UNIQUE,

    CONSTRAINT fk_conta_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

-- =====================================================
-- TRANSFERENCIA
-- =====================================================

CREATE TABLE transferencia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    conta_origem_id BIGINT NOT NULL,

    conta_destino_id BIGINT NOT NULL,

    valor DECIMAL(15,2) NOT NULL,

    data_transferencia DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_transferencia_origem
        FOREIGN KEY (conta_origem_id)
        REFERENCES conta(id),

    CONSTRAINT fk_transferencia_destino
        FOREIGN KEY (conta_destino_id)
        REFERENCES conta(id)
);

-- =====================================================
-- INVESTIMENTO
-- =====================================================

CREATE TABLE investimento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    tipo VARCHAR(50) NOT NULL,

    valor_aplicado DECIMAL(15,2) NOT NULL,

    rendimento DECIMAL(15,2) NOT NULL DEFAULT 0.00,

    data_aplicacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    usuario_id BIGINT NOT NULL,

    CONSTRAINT fk_investimento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id)
);

-- =====================================================
-- MOVIMENTACAO
-- =====================================================

CREATE TABLE movimentacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    tipo ENUM(
        'TRANSFERENCIA_ENVIADA',
        'TRANSFERENCIA_RECEBIDA',
        'INVESTIMENTO',
        'DEPOSITO',
        'SAQUE'
    ) NOT NULL,

    valor DECIMAL(15,2) NOT NULL,

    descricao VARCHAR(200),

    data_movimentacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    conta_id BIGINT NOT NULL,

    CONSTRAINT fk_movimentacao_conta
        FOREIGN KEY (conta_id)
        REFERENCES conta(id)
);

-- =====================================================
-- INDICES
-- =====================================================

CREATE INDEX idx_transferencia_origem
ON transferencia(conta_origem_id);

CREATE INDEX idx_transferencia_destino
ON transferencia(conta_destino_id);

CREATE INDEX idx_investimento_usuario
ON investimento(usuario_id);

CREATE INDEX idx_movimentacao_conta
ON movimentacao(conta_id);

CREATE INDEX idx_movimentacao_data
ON movimentacao(data_movimentacao);