import mysql from 'mysql2';
import dotenv from 'dotenv';

// App Variables
dotenv.config();

// DB CONFIG
const dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: 'mysql',
  pool: {
    max: 20,
    min: 0,
  },
};

// MySQL
// Connect To The Database
export const conn = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  connectionLimit: dbConfig.pool.max,
  waitForConnections: true,
  queueLimit: 0,
});

// Query Async
export const queryAsync = (sql: string, values?: any) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// TABLE INTERFACES
export interface USER_TABLE {
  userId: number;
  username: string;
  password: string;
  displayName: string;
  image: string;
  note: string | null;
  type: 'admin' | 'user';
  joinDate: Date;
}

export interface IMAGE_TABLE {
  id: number;
  userId: number;
  imageURL: string;
  score: number;
  name: string;
  series_name: string;
  description: string | null;
  last_update: Date;
}

export interface VOTE_TABLE {
  vid: number;
  userId: number;
  imageId: number;
  score: number;
  timestamp: string;
}
