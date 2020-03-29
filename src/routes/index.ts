import { Router } from 'express';
import FileRouter from './file';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/file', FileRouter);

// Export the base-router
export default router;
