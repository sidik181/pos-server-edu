import env from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
env.config()
import('./services/database.js')

import authRouter from './routes/authRoutes.js';
import productRouter from './routes/productRoutes.js';
import transactionRouter from './routes/transactionRoute.js';
import { notFoundError, errorHandler } from './middlewares/errorMiddleware.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', productRouter);
app.use('/api', transactionRouter);
app.use(notFoundError);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}.`)
});