import express, { Request, Response } from 'express';
import { generateJWT, verifyToken } from '../utils/jwt';
import { UserNewRequest } from '../model/user_new_req';
import { USER_TABLE, queryAsync } from '../config/dbconnect';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { OkPacket } from 'mysql2';
import { FileMiddleware } from '../middleware/file_middleware';
import { uploadFile } from '../utils/firebase';
export const authRouter = express.Router();

// config multipart/form-data requests multer
const fileMiddleware = new FileMiddleware();
// POST NEW USER SIGN UP
authRouter.post('/register', fileMiddleware.diskLoader.single('file'), async (req: Request, res: Response) => {
  const user: UserNewRequest = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ status: 'error', message: 'Invalid Input' });
  }

  const imageURL = await uploadFile(file);

  // Check user complete input type
  if (imageURL && user.username && user.password) {
    // Check username is unique
    let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
    const result = await queryAsync(sql, [user.username]) as USER_TABLE[];
    if (result.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Username already exists' });
    }

    // Hash Password
    user.password = await hashPassword(user.password);

    // Insert new user
    sql = `INSERT INTO allstarUsers (username, password, displayName, image) VALUES (?, ?, ?, ?)`;
    const resultInsert = await queryAsync(sql, [user.username, user.password, user.displayName, imageURL]) as OkPacket;
    if (resultInsert.affectedRows === 0) {
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }

    // Generate JWT token
    const result2 = await queryAsync(`SELECT * FROM allstarUsers WHERE userId = ?`, [resultInsert.insertId]) as USER_TABLE[];
    const userDB = result2[0];
    const token = generateJWT({
      userId: userDB.userId,
      username: userDB.username,
      displayName: userDB.displayName,
      image: userDB.image,
      type: userDB.type
    });

    return res.status(200).json({ status: 'ok', message: 'User created', token: token });
  }

  return res.status(400).json({ status: 'error', message: 'Invalid input' });
});

// POST USER LOGIN
authRouter.post('/login', async (req: Request, res: Response) => {
  const user: UserNewRequest = req.body;
  if (user.username && user.password) {
    let sql = `SELECT * FROM allstarUsers WHERE username = ?`;
    const result = await queryAsync(sql, [user.username]) as USER_TABLE[];
    if (result.length > 0) {
      const userDB = result[0];
      const isPasswordMatch = await comparePassword(user.password, userDB.password);
      if (isPasswordMatch) {
        const token = generateJWT({
          userId: userDB.userId,
          username: userDB.username,
          displayName: userDB.displayName,
          image: userDB.image,
          type: userDB.type
        });
        return res.status(200).json({ status: 'ok', message: 'Login success', token: token });
      }
    }

    return res.status(400).json({ status: 'error', message: 'Invalid username or password' });
  }
  return res.status(400).json({ status: 'error', message: 'Invalid input' });
});

// POST TO VERIFY TOKEN
authRouter.post('/verify', async (req: Request, res: Response) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (token) {
      const result: any = verifyToken(token);
      if (result.valid) {
        return res.status(200).json({ status: 'ok', message: 'Token is valid', data: result.decoded });
      }
    }
  }
  return res.status(400).json({ status: 'error', message: 'Invalid token' });
});
