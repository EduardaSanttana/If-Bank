-- ==========================================================
-- MIGRACAO: adicionar status REJEITADO ao usuario
-- ==========================================================
-- Necessario apenas se o banco "ifbank" ja existia ANTES desta
-- atualizacao (o schema.sql sozinho nao altera tabelas existentes
-- porque o projeto usa spring.jpa.hibernate.ddl-auto=validate).
--
-- Rode este script uma unica vez no seu banco MySQL local:
--   mysql -u root -p ifbank < migracao_status_rejeitado.sql
-- ==========================================================

USE ifbank;

ALTER TABLE usuario
    MODIFY COLUMN status ENUM('PENDENTE','APROVADO','REJEITADO')
        NOT NULL DEFAULT 'PENDENTE';
