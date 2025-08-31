import swaggerJsdoc from 'swagger-jsdoc';
import { join } from 'path';

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
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api-to-do-production-9b51.up.railway.app'
          : 'http://localhost:3001',
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

// Para debug
console.log('Swagger configuration loaded');
console.log('API documentation will be available at /api-docs');
console.log('Current environment:', process.env.NODE_ENV);
console.log('API URL:', options.definition.servers[0].url);
