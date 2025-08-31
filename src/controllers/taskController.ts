import { Request, Response } from 'express';
import pool from '../database/db';
 
export async function createTask(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { titulo, descricao } = req.body;
  if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });
  try {
    const result = await pool.query(
      'INSERT INTO tarefas (usuario_id, titulo, descricao) VALUES ($1, $2, $3) RETURNING *',
      [userId, titulo, descricao]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
}

export async function listTasks(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC',
      [userId]
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
}

export async function updateTask(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  try {
    const tarefa = await pool.query(
      'SELECT * FROM tarefas WHERE id = $1 AND usuario_id = $2',
      [id, userId]
    );
    if (tarefa.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    await pool.query(
      'UPDATE tarefas SET titulo = $1, descricao = $2 WHERE id = $3',
      [titulo, descricao, id]
    );
    return res.json({ message: 'Tarefa atualizada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
}

export async function deleteTask(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { id } = req.params;
  try {
    const tarefa = await pool.query(
      'SELECT * FROM tarefas WHERE id = $1 AND usuario_id = $2',
      [id, userId]
    );
    if (tarefa.rows.length === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
    return res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
}
