import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../store/store';
import { setPrices } from '../store/priceSlice';

let socket: Socket | null = null;

export const initializeWebSocket = (dispatch: AppDispatch) => {
  if (socket) return;

  socket = io('ws://localhost:5000'); // Replace with your WebSocket server URL

  socket.on('priceUpdate', (data: any) => {
    console.log(data,'data on price update')
    dispatch(setPrices(data));
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
  });
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
