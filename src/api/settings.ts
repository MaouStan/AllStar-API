import express, { Request, Response } from 'express';
import { conn } from '../config/dbconnect';
import { ResultSetHeader, QueryError, RowDataPacket } from 'mysql2';

export const settingsRouter = express.Router();

// GET ASTime from table allstarSettings
settingsRouter.get('/ASTime', (req: Request, res: Response) => {
  const sql = `SELECT ASTime FROM allstarSettings WHERE id = 1`;
  conn.query(sql, (err: QueryError, result: RowDataPacket[]) => {
    if (err) {
      return res.status(500).json({ message: 'Error getting ASTime' });
    }
    res.status(200).json({ status: "ok", data: result[0].ASTime });
  });
});

// PUT update ASTime from table allstarSettings
settingsRouter.put('/ASTime', async (req: Request, res: Response) => {
  const { astime } = req.body;
  const updateASTimeQuery = `UPDATE allstarSettings SET ASTime = ? WHERE id = 1`;
  conn.query(updateASTimeQuery, [astime], (err: QueryError, result: ResultSetHeader) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating ASTime' });
    }
    res.status(200).json({ message: 'ASTime updated successfully' });
  });
});
