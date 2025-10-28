export const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Happmobi API', version: '1.0.0' },
  servers: [{ url: '/api' }],
  paths: {
    '/auth/register': { post: { summary: 'Register', responses: { '201': { description: 'Created' } } } },
    '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'OK' } } } },
    '/users': { get: { summary: 'List users', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } }, post: { summary: 'Create user', responses: { '201': { description: 'Created' } } } },
    '/users/{id}': { get: { summary: 'Get user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } }, put: { summary: 'Update user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } }, delete: { summary: 'Delete user', security: [{ bearerAuth: [] }], responses: { '204': { description: 'No Content' } } } },
    '/users/{id}/vehicles': { get: { summary: 'List vehicles of user', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } } },
    '/vehicles': { get: { summary: 'List vehicles', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } }, post: { summary: 'Create vehicle', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Created' } } } },
    '/vehicles/{id}': { put: { summary: 'Update vehicle', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } }, delete: { summary: 'Delete vehicle', security: [{ bearerAuth: [] }], responses: { '204': { description: 'No Content' } } } },
    '/reservations': { post: { summary: 'Reserve vehicle', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Created' } } } },
    '/reservations/{id}': { delete: { summary: 'Release reservation', security: [{ bearerAuth: [] }], responses: { '204': { description: 'No Content' } } } },
    '/reservations/user/{userId}': { get: { summary: 'List user reservations', security: [{ bearerAuth: [] }], responses: { '200': { description: 'OK' } } } }
  },
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } }
};

