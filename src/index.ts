import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API To-Do Documentation'
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Redirect /swagger to /api-docs
app.get('/swagger', (req, res) => {
  res.redirect('/api-docs');
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API To-Do está funcionando!',
    docs: '/api-docs',
    endpoints: {
      users: '/users',
      tasks: '/tasks'
    }
  });
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
});