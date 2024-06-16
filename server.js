import env from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
env.config()
import('./src/services/database.js')

import authRouter from './src/routes/authRoutes.js';
import productRouter from './src/routes/productRoutes.js';
import transactionRouter from './src/routes/transactionRoute.js';
import { notFoundError, errorHandler } from './src/middlewares/errorMiddleware.js';
import tokenSession from './src/middlewares/tokenSession.js';

const corsOptions = {
  origin: 'http://localhost:1213',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(tokenSession);

app.use('/api', authRouter);
app.use('/api', productRouter);
app.use('/api', transactionRouter);
app.use(notFoundError);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}.`)
});