// Konfigurasi DB identik dengan backend temenmu
// supaya bisa connect ke database yang sama
require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'adminposyandu',
  password: process.env.DB_PASSWORD || 'pass123',
  database: process.env.DB_NAME || 'telemedicine_posyandu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
};

// Support Cloud SQL socket (untuk deploy GCP)
if (process.env.DB_SOCKET_PATH) {
  dbConfig.socketPath = process.env.DB_SOCKET_PATH;
  delete dbConfig.host;
  delete dbConfig.port;
}

if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { minVersion: 'TLSv1.2', rejectUnauthorized: false };
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
