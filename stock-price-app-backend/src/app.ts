import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import priceRoutes from './routes/priceRoutes';
import connectDB from './config/db';
import fetchAndStorePrices from './services/pricePoller';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/api', priceRoutes);

// Start price polling service
fetchAndStorePrices(io);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

export default server;
