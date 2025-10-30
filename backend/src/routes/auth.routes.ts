import { Router } from 'express';
import { login, register, resetPasswordDirect } from '../controllers/auth.controller';
const router = Router();
router.post('/login', login);
router.post('/register', register);
router.post('/reset-password-direct', resetPasswordDirect);
export default router;

