import { Router } from 'express';
import ImageRouter from './Images';
import VideoRouter from './Videos';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/images', ImageRouter);
router.use('/videos', VideoRouter);

// Export the base-router
export default router;
