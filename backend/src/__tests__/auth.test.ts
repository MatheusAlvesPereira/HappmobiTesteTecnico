import request from 'supertest';
import { createTestApp, createTestUser } from './helpers';
import { User } from '../models/user.model';

describe('Auth Routes', () => {
  const app = createTestApp();

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not register user with duplicate username', async () => {
      await createTestUser(app, { username: 'duplicate', email: 'duplicate1@example.com', password: 'pass123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'duplicate',
          email: 'duplicate2@example.com',
          password: 'pass123'
        })
        .expect(409);

      expect(response.body.message).toContain('username');
    });

    it('should not register user with duplicate email', async () => {
      await createTestUser(app, { username: 'user1', email: 'duplicate@example.com', password: 'pass123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'pass123'
        })
        .expect(409);

      expect(response.body.message).toContain('email');
    });

    it('should require all fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test'
        })
        .expect(400);

      expect(response.body.message).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser(app);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
    });

    it('should not login with invalid username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});

