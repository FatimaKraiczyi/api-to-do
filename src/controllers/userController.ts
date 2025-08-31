import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../database/db';
 
export async function register(req: Request, res: Response) {
  const { nome, email, senha, confirmarSenha } = req.body;
  if (!nome || !email || !senha || !confirmarSenha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  if (senha !== confirmarSenha) {
    return res.status(400).json({ error: 'Senhas não conferem' });
  }
  try {
    const userExists = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    const hash = await bcrypt.hash(senha, 10);
    await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, hash]
    );
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
  } catch (err: any) {
    console.error('Erro ao cadastrar usuário:', err);
    return res.status(500).json({ error: 'Erro ao cadastrar usuário', details: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }
  try {
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos' });
    }
    const valid = await bcrypt.compare(senha, user.rows[0].senha);
    if (!valid) {
      return res.status(400).json({ error: 'E-mail ou senha inválidos' });
    }
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

export async function getProfile(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const user = await pool.query('SELECT id, nome, email FROM usuarios WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json(user.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}

export async function updateProfile(req: Request, res: Response) {
  const userId = (req as any).user.id;
  const { nome, senha, confirmarSenha } = req.body;
  if (!nome && !senha) {
    return res.status(400).json({ error: 'Informe nome ou senha para atualizar' });
  }
  try {
    if (senha) {
      if (senha !== confirmarSenha) {
        return res.status(400).json({ error: 'Senhas não conferem' });
      }
      const hash = await bcrypt.hash(senha, 10);
      await pool.query('UPDATE usuarios SET nome = $1, senha = $2 WHERE id = $3', [nome, hash, userId]);
    } else {
      await pool.query('UPDATE usuarios SET nome = $1 WHERE id = $2', [nome, userId]);
    }
    return res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
}
