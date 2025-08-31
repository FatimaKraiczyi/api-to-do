/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 * 
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
 *           description: Descrição detalhada da tarefa
 *         completed:
 *           type: boolean
 *           description: Status de conclusão da tarefa
 *         userId:
 *           type: integer
 *           description: ID do usuário que criou a tarefa
 * 
 * paths:
 *   /users/register:
 *     post:
 *       tags:
 *         - Users
 *       summary: Registra um novo usuário
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         201:
 *           description: Usuário registrado com sucesso
 * 
 *   /users/login:
 *     post:
 *       tags:
 *         - Users
 *       summary: Login do usuário
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - password
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Login realizado com sucesso
 * 
 *   /tasks:
 *     get:
 *       tags:
 *         - Tasks
 *       summary: Lista todas as tarefas do usuário
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Lista de tarefas
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Task'
 * 
 *     post:
 *       tags:
 *         - Tasks
 *       summary: Cria uma nova tarefa
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       responses:
 *         201:
 *           description: Tarefa criada com sucesso
 * 
 *   /tasks/{id}:
 *     put:
 *       tags:
 *         - Tasks
 *       summary: Atualiza uma tarefa
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID da tarefa
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       responses:
 *         200:
 *           description: Tarefa atualizada com sucesso
 * 
 *     delete:
 *       tags:
 *         - Tasks
 *       summary: Remove uma tarefa
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID da tarefa
 *       responses:
 *         200:
 *           description: Tarefa removida com sucesso
 */
