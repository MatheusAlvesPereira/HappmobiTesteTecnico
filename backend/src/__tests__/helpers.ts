import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../routes';

export function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api', routes);
  return app;
}

export async function createTestUser(app: express.Application, userData?: { username?: string; email?: string; password?: string }) {
  const defaultUser = {
    username: userData?.username || 'testuser',
    email: userData?.email || 'test@example.com',
    password: userData?.password || 'password123'
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(defaultUser);

  return { ...defaultUser, id: response.body.id || response.body._id };
}

export async function loginUser(app: express.Application, username: string, password: string) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password });
  
  return response.body.token;
}

export async function getAuthToken(app: express.Application, username: string = 'testuser', password: string = 'password123') {
  try {
    await createTestUser(app, { username, email: `${username}@example.com`, password });
  } catch {
    // User might already exist
  }
  return await loginUser(app, username, password);
}

