import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API To-Do',
      version: '1.0.0',
      description: 'API para gerenciamento de tarefas',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], // arquivos que contêm anotações do swagger
};

export const specs = swaggerJsdoc(options);
