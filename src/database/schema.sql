-- Criação da tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    token_recuperacao VARCHAR(255),
    token_expiracao TIMESTAMP,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de tarefas
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'media',
    data_conclusao TIMESTAMP,
    usuario_id INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_tarefas_usuario ON tarefas(usuario_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_tarefas_status ON tarefas(status);

-- Trigger para atualizar o campo atualizado_em
CREATE OR REPLACE FUNCTION atualizar_timestamp_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger na tabela usuarios
CREATE TRIGGER atualizar_usuarios_timestamp
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp_atualizacao();

-- Aplicar trigger na tabela tarefas
CREATE TRIGGER atualizar_tarefas_timestamp
    BEFORE UPDATE ON tarefas
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp_atualizacao();

-- Comentários nas tabelas
COMMENT ON TABLE usuarios IS 'Tabela que armazena informações dos usuários do sistema';
COMMENT ON TABLE tarefas IS 'Tabela que armazena as tarefas criadas pelos usuários';

-- Comentários nas colunas da tabela usuarios
COMMENT ON COLUMN usuarios.id IS 'Identificador único do usuário';
COMMENT ON COLUMN usuarios.nome IS 'Nome completo do usuário';
COMMENT ON COLUMN usuarios.email IS 'Endereço de email do usuário (único)';
COMMENT ON COLUMN usuarios.senha IS 'Senha do usuário (hash)';
COMMENT ON COLUMN usuarios.token_recuperacao IS 'Token para recuperação de senha';
COMMENT ON COLUMN usuarios.token_expiracao IS 'Data de expiração do token de recuperação';
COMMENT ON COLUMN usuarios.criado_em IS 'Data de criação do registro';
COMMENT ON COLUMN usuarios.atualizado_em IS 'Data da última atualização do registro';

-- Comentários nas colunas da tabela tarefas
COMMENT ON COLUMN tarefas.id IS 'Identificador único da tarefa';
COMMENT ON COLUMN tarefas.titulo IS 'Título da tarefa';
COMMENT ON COLUMN tarefas.descricao IS 'Descrição detalhada da tarefa';
COMMENT ON COLUMN tarefas.status IS 'Status da tarefa (pendente, em_andamento, concluida)';
COMMENT ON COLUMN tarefas.prioridade IS 'Prioridade da tarefa (baixa, media, alta)';
COMMENT ON COLUMN tarefas.data_conclusao IS 'Data de conclusão da tarefa';
COMMENT ON COLUMN tarefas.usuario_id IS 'ID do usuário que criou a tarefa';
COMMENT ON COLUMN tarefas.criado_em IS 'Data de criação do registro';
COMMENT ON COLUMN tarefas.atualizado_em IS 'Data da última atualização do registro';
