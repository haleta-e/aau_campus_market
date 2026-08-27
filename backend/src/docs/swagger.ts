export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'AAU Campus Market API',
    version: '1.0.0',
    description: 'Production-Style E-Commerce Backend & Audit API for AAU Campus Market',
    contact: {
      name: 'AAU Campus Market Engineering Team',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Production API v1 Server',
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
  paths: {
    '/health': {
      get: {
        summary: 'System & Database Health Check',
        responses: {
          '200': { description: 'System healthy and database connected' },
          '500': { description: 'Database disconnected or server error' },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Service Readiness Check',
        responses: {
          '200': { description: 'Service ready to serve traffic' },
        },
      },
    },
  },
};
