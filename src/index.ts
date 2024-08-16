import dotenv from 'dotenv';
import { app } from './app';
import { conn } from './config/dbconnect';

//For env File
dotenv.config();

//For Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Connect to the database
  conn.getConnection((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });
});
