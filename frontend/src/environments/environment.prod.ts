import dotenv from 'dotenv';
dotenv.config();
export const environment = {
  production: true,
  apiUrl: process.env['API_ENDPOINT_PROD'],
  appName: 'MovieBooking',
  logLevel: 'error',
};
