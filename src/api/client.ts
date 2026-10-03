import axios from 'axios';

// Cliente Axios base configurado para apontar para a API simulada
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Timeout de 5 segundos
});