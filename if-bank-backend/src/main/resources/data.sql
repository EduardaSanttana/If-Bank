USE ifbank;

-- ==========================================
-- USUARIOS
-- ==========================================

INSERT INTO usuario (
    nome,
    cpf,
    data_nascimento,
    endereco,
    telefone,
    email,
    senha_hash,
    foto,
    perfil,
    status
) VALUES
(
    'Carlos Mendes',
    '11111111111',
    '1980-05-12',
    'Rua das Flores, 100',
    '(16)99999-1111',
    'gerente@ifbank.com',
    '$2a$10$EXEMPLOHASH',
    'uploads/carlos.jpg',
    'GERENTE',
    'APROVADO'
),
(
    'Joao Silva',
    '22222222222',
    '1998-08-20',
    'Av. Brasil, 500',
    '(16)99999-2222',
    'joao@ifbank.com',
    '$2a$10$EXEMPLOHASH',
    'uploads/joao.jpg',
    'CLIENTE',
    'APROVADO'
),
(
    'Maria Oliveira',
    '33333333333',
    '1995-11-15',
    'Rua Sao Paulo, 250',
    '(16)99999-3333',
    'maria@ifbank.com',
    '$2a$10$EXEMPLOHASH',
    'uploads/maria.jpg',
    'CLIENTE',
    'APROVADO'
);

-- ==========================================
-- CONTAS
-- ==========================================

INSERT INTO conta (
    numero_conta,
    saldo,
    usuario_id
) VALUES
(
    'IF000001',
    0.00,
    1
),
(
    'IF000002',
    5000.00,
    2
),
(
    'IF000003',
    3200.00,
    3
);

-- ==========================================
-- TRANSFERENCIAS
-- ==========================================

INSERT INTO transferencia (
    conta_origem_id,
    conta_destino_id,
    valor,
    data_transferencia
) VALUES
(
    2,
    3,
    250.00,
    '2026-06-01 10:15:00'
),
(
    3,
    2,
    100.00,
    '2026-06-02 14:20:00'
),
(
    2,
    3,
    50.00,
    '2026-06-03 09:45:00'
);

-- ==========================================
-- INVESTIMENTOS
-- ==========================================

INSERT INTO investimento (
    tipo,
    valor_aplicado,
    rendimento,
    data_aplicacao,
    usuario_id
) VALUES
(
    'CDB',
    1000.00,
    75.50,
    '2026-05-15 08:00:00',
    2
),
(
    'Tesouro Direto',
    1500.00,
    120.25,
    '2026-05-20 11:00:00',
    2
),
(
    'LCI',
    2000.00,
    98.40,
    '2026-05-25 16:30:00',
    3
);

-- ==========================================
-- MOVIMENTACOES
-- ==========================================

INSERT INTO movimentacao (
    tipo,
    valor,
    descricao,
    data_movimentacao,
    conta_id
) VALUES

(
    'TRANSFERENCIA_ENVIADA',
    250.00,
    'Transferencia para conta IF000003',
    '2026-06-01 10:15:00',
    2
),

(
    'TRANSFERENCIA_RECEBIDA',
    250.00,
    'Transferencia recebida da conta IF000002',
    '2026-06-01 10:15:00',
    3
),

(
    'TRANSFERENCIA_ENVIADA',
    100.00,
    'Transferencia para conta IF000002',
    '2026-06-02 14:20:00',
    3
),

(
    'TRANSFERENCIA_RECEBIDA',
    100.00,
    'Transferencia recebida da conta IF000003',
    '2026-06-02 14:20:00',
    2
),

(
    'INVESTIMENTO',
    1000.00,
    'Aplicacao em CDB',
    '2026-05-15 08:00:00',
    2
),

(
    'INVESTIMENTO',
    1500.00,
    'Aplicacao em Tesouro Direto',
    '2026-05-20 11:00:00',
    2
),

(
    'INVESTIMENTO',
    2000.00,
    'Aplicacao em LCI',
    '2026-05-25 16:30:00',
    3
);