import express from 'express';
import { registrar, login, obterPerfil, atualizarPerfil, esqueciSenha, redefinirSenha } from '../controllers/userController';
import { verificarToken } from '../middleware/auth';
import { body } from 'express-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         senha:
 *           type: string
 *           format: password
 *           description: Senha do usuário
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *     RespostaUsuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         criadoEm:
 *           type: string
 *           format: date-time
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 */

const router = express.Router();

// Validações
const validacaoRegistro = [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('confirmarSenha').custom((value, { req }) => {
        if (value !== req.body.senha) {
            throw new Error('As senhas não conferem');
        }
        return true;
    })
];

const validacaoLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('senha').notEmpty().withMessage('Senha é obrigatória')
];

const validacaoAtualizarPerfil = [
    body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('novaSenha').optional().isLength({ min: 6 }).withMessage('Nova senha deve ter no mínimo 6 caracteres'),
    body('confirmarSenha').custom((value, { req }) => {
        if (req.body.novaSenha && value !== req.body.novaSenha) {
            throw new Error('As senhas não conferem');
        }
        return true;
    })
];

/**
 * @swagger
 * /usuarios/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *               - confirmarSenha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *               confirmarSenha:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaUsuario'
 *       400:
 *         description: Dados inválidos
 */
router.post('/registrar', validacaoRegistro, registrar);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   $ref: '#/components/schemas/RespostaUsuario'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', validacaoLogin, login);

/**
 * @swagger
 * /usuarios/esqueci-senha:
 *   post:
 *     summary: Solicita redefinição de senha
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de redefinição enviado
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/esqueci-senha', body('email').isEmail(), esqueciSenha);

/**
 * @swagger
 * /usuarios/redefinir-senha/{token}:
 *   post:
 *     summary: Redefine a senha do usuário
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senha
 *               - confirmarSenha
 *             properties:
 *               senha:
 *                 type: string
 *                 format: password
 *               confirmarSenha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *       400:
 *         description: Token inválido ou senhas não conferem
 */
router.post('/redefinir-senha/:token', [
    body('senha').isLength({ min: 6 }),
    body('confirmarSenha').custom((value, { req }) => value === req.body.senha)
], redefinirSenha);

/**
 * @swagger
 * /usuarios/perfil:
 *   get:
 *     summary: Obtém o perfil do usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaUsuario'
 *       401:
 *         description: Não autorizado
 *   put:
 *     summary: Atualiza o perfil do usuário
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               senhaAtual:
 *                 type: string
 *                 format: password
 *               novaSenha:
 *                 type: string
 *                 format: password
 *               confirmarSenha:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaUsuario'
 *       401:
 *         description: Não autorizado
 */
router.get('/perfil', verificarToken, obterPerfil);
router.put('/perfil', verificarToken, validacaoAtualizarPerfil, atualizarPerfil);

export default router;
