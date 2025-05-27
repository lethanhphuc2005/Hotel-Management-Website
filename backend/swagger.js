const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Định nghĩa thông tin swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Quản lý khách sạn',
      version: '1.0.0',
      description: 'API cho hệ thống quản lý khách sạn',
    },
    servers: [
      { url: 'http://localhost:8000' },
    ],
  },
  // Đường dẫn đến file chứa chú thích API
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
