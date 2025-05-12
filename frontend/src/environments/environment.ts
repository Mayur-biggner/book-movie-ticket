import dotenv from 'dotenv';
dotenv.config();
export const environment = {
  production: false,
  apiUrl: process.env['API_ENDPOINT'],
  appName: 'MovieBooking-Dev',
  logLevel: 'debug',
};
