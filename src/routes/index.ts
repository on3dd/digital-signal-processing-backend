import { Router } from 'express';
import UserRouter from './Users';
import FileRouter from './file';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/file', FileRouter);

// Export the base-router
export default router;
