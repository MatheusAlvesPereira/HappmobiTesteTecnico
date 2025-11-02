import request from 'supertest';
import { createTestApp, getAuthToken } from './helpers';

describe('Users Routes', () => {
  const app = createTestApp();
  let authToken: string;

  beforeEach(async () => {
    authToken = await getAuthToken(app);
  });

  describe('POST /api/users', () => {
    it('should create user when authenticated', async () => {
      const userData = {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'adminpass123'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(userData.username);
      expect(response.body.email).toBe(userData.email);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          username: 'test',
          email: 'test@example.com',
          password: 'pass123'
        })
        .expect(401);

      expect(response.body.message).toBe('Token required');
    });
  });

  describe('GET /api/users', () => {
    it('should list all users when authenticated', async () => {
      // Create additional users
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass123'
        });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach((user: any) => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id when authenticated', async () => {
      // Create a user first
      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'getuser',
          email: 'getuser@example.com',
          password: 'pass123'
        });

      const userId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.username).toBe('getuser');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Usuário não encontrado');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user when authenticated', async () => {
      // Create a user first
      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'updateuser',
          email: 'updateuser@example.com',
          password: 'pass123'
        });

      const userId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'updateduser',
          email: 'updateduser@example.com'
        })
        .expect(200);

      expect(response.body.username).toBe('updateduser');
      expect(response.body.email).toBe('updateduser@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ username: 'test' })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user when authenticated', async () => {
      // Create a user first
      const createResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'deleteuser',
          email: 'deleteuser@example.com',
          password: 'pass123'
        });

      const userId = createResponse.body.id;

      await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify user is deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /api/users/:id/vehicles', () => {
    it('should list vehicles for a user when authenticated', async () => {
      // Create a user
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'vehicleuser',
          email: 'vehicleuser@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;

      // Create a vehicle and reserve it
      const createVehicleResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'ABC1234'
        });

      const vehicleId = createVehicleResponse.body._id;

      // Reserve vehicle for user
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId
        });

      const response = await request(app)
        .get(`/api/users/${userId}/vehicles`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

