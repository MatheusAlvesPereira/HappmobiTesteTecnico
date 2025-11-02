import { Router } from 'express';
import { createUser, updateUser, deleteUser, getUserById, listUsers, listUserVehicles } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
const router = Router();

router.post('/', authenticate, createUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, deleteUser);
router.get('/:id', authenticate, getUserById);
router.get('/', authenticate, listUsers);
router.get('/:id/vehicles', authenticate, listUserVehicles);

export default router;

