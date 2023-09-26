const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Upload and Document API',
      version: '1.0.0',
      description: 'API documentation for file upload and document management',
    },
    servers: [
      {
        url: '/api', // Define your base URL here
      },
    ],
  },
  apis: ['./app/controllers/login.js',
<<<<<<< HEAD
        './app/controllers/resetPassword.js',
        './app/controllers/fileProcessor.js',
      './app/controllers/certification.js',
      './app/controllers/regulation.js',
      './app/controllers/tr_mapping.js']
    // Define the path to your route files
=======
    './app/controllers/resetPassword.js',
    './app/controllers/fileProcessor.js',
    './app/controllers/certification.js',
    './app/controllers/regulation.js',
    './app/controllers/mea_plugs.js']
>>>>>>> c3bf78a367e1601bfb64a82c5066c664665c6b40
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
