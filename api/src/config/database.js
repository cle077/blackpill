import mysql from 'mysql2';
import 'dotenv/config';

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: 'root', 
    password: process.env.DB_PASSWORD,
    database: 'blackpillbd',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); 

export default db;