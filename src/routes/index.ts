import { Router } from 'express';
import ImageRouter from './Images';
import VideoRouter from './Videos';
import {KeycloakMiddleware} from '../shared/Keycloak';

// Init router and path
const router = Router();

const keycloak = KeycloakMiddleware.getInstance();
// Add sub-routes
router.use('/images', keycloak.protect(), ImageRouter);
router.use('/videos', keycloak.protect(), VideoRouter);

// Export the base-router
export default router;
