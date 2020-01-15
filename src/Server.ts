import cookieParser from 'cookie-parser';
import express from 'express';
import { Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';
import BaseRouter from './routes';
import {KeycloakMiddleware} from './shared/Keycloak';

// Init express
const app = express();
// Add middleware/settings/routes to express.
if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = ['http://erzo.wtf', 'http://localhost:3000'];
    app.use(cors({
        origin: allowedOrigins,
        exposedHeaders: 'Content-Location',
        credentials: true,
    }));
} else {
    app.use(cors({
        exposedHeaders: 'Content-Location',
    }));
}
app.use(KeycloakMiddleware.getInstance().middleware());
app.use('', BaseRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Export express instance
export default app;
