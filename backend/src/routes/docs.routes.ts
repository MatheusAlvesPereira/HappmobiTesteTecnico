import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';
import { swaggerSpec } from '../docs/spec';
const router = Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default router;

