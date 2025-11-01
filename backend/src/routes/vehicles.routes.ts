import { Router } from 'express';
import { createVehicle, updateVehicle, deleteVehicle, listVehicles } from '../controllers/vehicles.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createVehicle);
router.put('/:id', authenticate, updateVehicle);
router.delete('/:id', authenticate, deleteVehicle);
router.get('/', authenticate, listVehicles);

export default router;

