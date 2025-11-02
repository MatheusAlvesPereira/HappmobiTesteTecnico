import request from 'supertest';
import { createTestApp, getAuthToken } from './helpers';

describe('Reservations Routes', () => {
  const app = createTestApp();
  let authToken: string;

  beforeEach(async () => {
    authToken = await getAuthToken(app);
  });

  describe('POST /api/reservations', () => {
    it('should create reservation when authenticated', async () => {
      // Create a user
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'reserveuser',
          email: 'reserveuser@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;

      // Create a vehicle
      const createVehicleResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'RESERVE1234'
        });

      const vehicleId = createVehicleResponse.body._id;

      // Create reservation
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId
        })
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('vehicleId');
      expect(response.body.status).toBe('reserved');

      // Verify vehicle is marked as reserved by checking list
      const vehiclesResponse = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const reservedVehicle = vehiclesResponse.body.find((v: any) => v._id === vehicleId);
      expect(reservedVehicle.isReserved).toBe(true);
      expect(reservedVehicle.reservedBy).toBe(userId);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/reservations')
        .send({
          userId: '507f1f77bcf86cd799439011',
          vehicleId: '507f1f77bcf86cd799439012'
        })
        .expect(401);
    });

    it('should not reserve an already reserved vehicle', async () => {
      // Create users
      const user1Response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'user1',
          email: 'user1@example.com',
          password: 'pass123'
        });

      const user2Response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'user2',
          email: 'user2@example.com',
          password: 'pass123'
        });

      const userId1 = user1Response.body.id;
      const userId2 = user2Response.body.id;

      // Create a vehicle
      const createVehicleResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'RESERVED1234'
        });

      const vehicleId = createVehicleResponse.body._id;

      // First reservation should succeed
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId1,
          vehicleId
        })
        .expect(201);

      // Second reservation should fail
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: userId2,
          vehicleId
        })
        .expect(400);

      expect(response.body.message).toBe('Veículo já está reservado');
    });

    it('should not allow a user to reserve more than one vehicle', async () => {
      // Create a user
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'multireserve',
          email: 'multireserve@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;

      // Create vehicles
      const vehicle1Response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'MULTI1234'
        });

      const vehicle2Response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          color: 'Black',
          licensePlate: 'MULTI5678'
        });

      const vehicleId1 = vehicle1Response.body._id;
      const vehicleId2 = vehicle2Response.body._id;

      // First reservation should succeed
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId: vehicleId1
        })
        .expect(201);

      // Second reservation should fail
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId: vehicleId2
        })
        .expect(400);

      expect(response.body.message).toBe('Você já possui uma reserva ativa');
    });

    it('should require userId and vehicleId', async () => {
      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId: '507f1f77bcf86cd799439011'
        })
        .expect(400);

      expect(response.body.message).toContain('obrigatórios');
    });

    it('should return 404 for non-existent vehicle', async () => {
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'notfounduser',
          email: 'notfounduser@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;
      const fakeVehicleId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId: fakeVehicleId
        })
        .expect(404);

      expect(response.body.message).toBe('Veículo não encontrado');
    });
  });

  describe('DELETE /api/reservations/:id', () => {
    it('should release reservation when authenticated', async () => {
      // Create a user
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'releaseuser',
          email: 'releaseuser@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;

      // Create a vehicle
      const createVehicleResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'RELEASE1234'
        });

      const vehicleId = createVehicleResponse.body._id;

      // Create reservation
      const createReservationResponse = await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId
        });

      const reservationId = createReservationResponse.body._id;

      // Release reservation
      await request(app)
        .delete(`/api/reservations/${reservationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify vehicle is no longer reserved by checking list
      const vehiclesResponse = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const releasedVehicle = vehiclesResponse.body.find((v: any) => v._id === vehicleId);
      expect(releasedVehicle.isReserved).toBe(false);
      expect(releasedVehicle.reservedBy).toBeNull();
    });

    it('should require authentication', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .delete(`/api/reservations/${fakeId}`)
        .expect(401);
    });

    it('should return 404 for non-existent reservation', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/reservations/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Reserva não encontrada');
    });
  });

  describe('GET /api/reservations/user/:userId', () => {
    it('should list user reservations when authenticated', async () => {
      // Create a user
      const createUserResponse = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          username: 'listuser',
          email: 'listuser@example.com',
          password: 'pass123'
        });

      const userId = createUserResponse.body.id;

      // Create a vehicle
      const createVehicleResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'LIST1234'
        });

      const vehicleId = createVehicleResponse.body._id;

      // Create reservation
      await request(app)
        .post('/api/reservations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          userId,
          vehicleId
        });

      // List reservations
      const response = await request(app)
        .get(`/api/reservations/user/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].userId).toBe(userId);
    });

    it('should require authentication', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/api/reservations/user/${fakeId}`)
        .expect(401);
    });
  });
});

