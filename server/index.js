import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { connectDB } from './database/connectDB.js';
import authRoutes from './routes/auth.route.js';
import categoryRoutes from './routes/category.route.js';
import exhibitRoutes from './routes/exhibit.route.js';
import ticketRoutes from './routes/ticket.route.js';

dotenv.config();

const port = process.env.PORT || 8000;
const __dirname = path.resolve();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api', (req, res) => {
  res.send('Server up and running');
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(port, () => {
  connectDB();
  console.log('Server is running on port 8000');
});
