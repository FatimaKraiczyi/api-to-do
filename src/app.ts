import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Configuração do CORS
app.use(cors());

app.use(express.json());

// Rotas da API
app.use('/usuarios', userRoutes);
app.use('/tarefas', taskRoutes);

// Swagger setup
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API To-Do Documentation'
};

// Documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Redireciona a rota raiz para a documentação
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    codigo: 404,
    timestamp: new Date().toISOString(),
    caminho: req.originalUrl
  });
});

// Middleware para tratamento de erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    erro: "Erro interno do servidor",
    codigo: 500,
    timestamp: new Date().toISOString(),
    mensagem: err.message
  });
});

export default app;
