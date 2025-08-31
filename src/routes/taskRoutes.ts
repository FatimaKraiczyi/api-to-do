import express from 'express';
import { createTask, listTasks, updateTask, deleteTask } from '../controllers/taskController';
import { verificarToken } from '../middleware/auth';

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da tarefa
 *         title:
 *           type: string
 *           description: Título da tarefa
 *         description:
 *           type: string
 *           description: Descrição da tarefa
 *         completed:
 *           type: boolean
 *           description: Status de conclusão da tarefa
 *         userId:
 *           type: integer
 *           description: ID do usuário proprietário da tarefa
 */

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       401:
 *         description: Não autorizado
 * 
 *   get:
 *     summary: Lista todas as tarefas do usuário
 *     security:
 *       - bearerAuth: []
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */

router.post('/', verificarToken, createTask);
router.get('/', verificarToken, listTasks);
router.put('/:id', verificarToken, updateTask);
router.delete('/:id', verificarToken, deleteTask);

export default router;
