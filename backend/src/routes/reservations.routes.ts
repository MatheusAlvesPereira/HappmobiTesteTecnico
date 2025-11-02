import { Router } from 'express';
import { createReservation, releaseReservation, listUserReservations } from '../controllers/reservations.controller';
import { authenticate } from '../middlewares/auth.middleware';
const router = Router();

router.post('/', authenticate, createReservation);
router.delete('/:id', authenticate, releaseReservation);
router.get('/user/:userId', authenticate, listUserReservations);

export default router;

