import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import vehiclesRoutes from './vehicles.routes';
import reservationsRoutes from './reservations.routes';
import docsRoutes from './docs.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/docs', docsRoutes);

export default router;

