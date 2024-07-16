import env from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
env.config()
import('./services/database.js');

const PORT = process.env.PORT || 3000;
const FE_URI = process.env.FE_URI;

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoutes.js';
import transactionRouter from './routes/transactionRoute.js';
import { notFoundError, errorHandler } from './middlewares/errorMiddleware.js';

const corsOptions = {
  origin: FE_URI,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', transactionRouter);
app.use(notFoundError);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}.`)
});