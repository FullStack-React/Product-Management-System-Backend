import express from 'express';
import userRouter from './routers/user.ts';
import authRouter from './routers/auth.ts';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

let allowedOrigins = ['http://localhost:5173'];

mongoose
  .connect(process.env.URI || '', {})
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Error:', error);
    throw error;
  });

const app = express();

app.use(cors({ origin: allowedOrigins }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
