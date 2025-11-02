import request from 'supertest';
import { createTestApp, getAuthToken } from './helpers';

describe('Vehicles Routes', () => {
  const app = createTestApp();
  let authToken: string;

  beforeEach(async () => {
    authToken = await getAuthToken(app);
  });

  describe('POST /api/vehicles', () => {
    it('should create vehicle when authenticated', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
        licensePlate: 'ABC1234'
      };

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vehicleData)
        .expect(201);

      expect(response.body.make).toBe(vehicleData.make);
      expect(response.body.model).toBe(vehicleData.model);
      expect(response.body.year).toBe(vehicleData.year);
      expect(response.body.color).toBe(vehicleData.color);
      expect(response.body.licensePlate).toBe(vehicleData.licensePlate);
      expect(response.body.isReserved).toBe(false);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/vehicles')
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'ABC1234'
        })
        .expect(401);
    });

    it('should not create vehicle with duplicate license plate', async () => {
      const vehicleData = {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
        licensePlate: 'DUPLICATE123'
      };

      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vehicleData)
        .expect(201);

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send(vehicleData)
        .expect(400);

      expect(response.body.message).toContain('Placa já cadastrada');
    });

    it('should require all required fields', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota'
        })
        .expect(400);
    });
  });

  describe('GET /api/vehicles', () => {
    it('should list all vehicles when authenticated', async () => {
      // Create some vehicles
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'LIST1234'
        });

      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          color: 'Black',
          licensePlate: 'LIST5678'
        });

      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/vehicles')
        .expect(401);
    });
  });


  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle when authenticated', async () => {
      const createResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'UPDATE1234'
        });

      const vehicleId = createResponse.body._id;

      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          color: 'Red',
          year: 2021
        })
        .expect(200);

      expect(response.body.color).toBe('Red');
      expect(response.body.year).toBe(2021);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ color: 'Red' })
        .expect(404);

      expect(response.body.message).toBe('Veículo não encontrado');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should delete vehicle when authenticated', async () => {
      const createResponse = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'White',
          licensePlate: 'DELETE1234'
        });

      const vehicleId = createResponse.body._id;

      await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify vehicle is deleted by checking list
      const vehiclesResponse = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedVehicle = vehiclesResponse.body.find((v: any) => v._id === vehicleId);
      expect(deletedVehicle).toBeUndefined();
    });

    it('should return 404 for non-existent vehicle', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      await request(app)
        .delete(`/api/vehicles/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});

