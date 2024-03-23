import express from 'express';
import userRouter from './routers/user.ts';
import authRouter from './routers/auth.ts';
import productRouter from './routers/product.ts';
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

// store product images in a folder, serve as a static site
// e.g. http://localhost:3000/images/picture1.jpg to access picture1.jpg in folder
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/product', productRouter);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
