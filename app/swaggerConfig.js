const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Upload and Document API',
      version: '1.0.0',
      description: 'API documentation for file upload and document management',
    },
  },
  apis: ['./app/controllers/login.js',
        './app/controllers/resetPassword.js',
        './app/controllers/fileProcessor.js'], // Define the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
