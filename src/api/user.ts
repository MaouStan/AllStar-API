import express, { Request, Response } from 'express';
import { USER_TABLE, conn, queryAsync } from '../config/dbconnect';
import { OkPacket, QueryError } from 'mysql2';
import { comparePassword, hashPassword } from '../utils/bcrypt';
import { FileMiddleware } from '../middleware/file_middleware';
import { uploadFile } from '../utils/firebase';
import { generateJWT } from '../utils/jwt';
export const userRouter = express.Router();

// GET /api/user
userRouter.get('/', (req: Request, res: Response) => {
  const sql = `
    SELECT
    allstarUsers.userId,
    allstarUsers.username,
    allstarUsers.image,
    allstarUsers.note,
    DATE_FORMAT(allstarUsers.joinDate, '%d-%m-%Y %H:%i:%s') AS joinDate,
    IFNULL(DATE_FORMAT(MAX(GREATEST(allstarImages.last_update, vote.timestamp)), '%d-%m-%Y %H:%i:%s'), DATE_FORMAT(allstarUsers.joinDate, '%d-%m-%Y %H:%i:%s')) AS lastActivity
    FROM allstarUsers
    LEFT JOIN allstarVoting vote ON allstarUsers.userId = vote.userId
    LEFT JOIN allstarImages ON vote.imageId = allstarImages.id
    WHERE type = 'user'
    GROUP BY allstarUsers.userId, allstarUsers.username, allstarUsers.image, allstarUsers.joinDate
  `;

  conn.query(sql, (err, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/user/:id
userRouter.get('/:id', (req: Request, res: Response) => {
  const userId = req.params.id;

  // Query user by id
  let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
  conn.query(sql, [userId], (err, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }
    let user: USER_TABLE = result[0] as unknown as USER_TABLE;
    // Remove password
    delete (user as Partial<USER_TABLE>).password;
    res.status(200).json({ status: 'ok', data: user });
  });
});

// PUT /api/user/chnagepasswrod
userRouter.put('/chnagepasswrod', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const user: USER_TABLE & { oldPassword?: string, newPassword?: string } = req.body;
  // Get Old Data User by id
  let sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
  const oldUserData: USER_TABLE = (await queryAsync(sql, [userId]) as USER_TABLE[])[0];
  if (!oldUserData) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  // check if user want to update password
  if (user.newPassword) {
    // check if user input old password
    if (!user.oldPassword) {
      return res.status(400).json({ status: 'error', message: 'Old password is required' });
    }
    // check if user input password is same with old password
    const isPasswordMatch = await comparePassword(user.oldPassword, oldUserData.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ status: 'error', message: 'Old password is wrong' });
    }

    // Hash new password
    user.password = await hashPassword(user.newPassword);
  }

  // Merge new data with old data
  const { oldPassword, newPassword, ...newUserData } = { ...oldUserData, ...user };

  // Update User
  sql = `UPDATE allstarUsers SET ? WHERE userId = ?`;
  await queryAsync(sql, [newUserData, userId])
  res.status(200).json({ status: 'ok', message: 'User updated successfully.' });
});

// PUT /api/user/:id
const fileMiddleware = new FileMiddleware();
userRouter.put('/:id', fileMiddleware.diskLoader.single('file'), async (req: Request, res: Response) => {
  let user: {
    userId: number,
    displayName: string,
    note: string,
    imageURL?: string, // Add the 'imageURL' property
  } = req.body;
  const file = req.file;

  // if file
  if (file) {
    user.imageURL = await uploadFile(file);
  }

  // update
  let sql = `UPDATE allstarUsers SET ? WHERE userId = ?`;
  conn.query(sql, [user, user.userId], async (err, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    // get userDB
    const sql = `SELECT * FROM allstarUsers WHERE userId = ?`;
    const result2 = await queryAsync(sql, [user.userId]) as USER_TABLE[];
    if (result2.length > 0) {
      const userDB = result2[0];    // return jwt token
      const token = generateJWT({
        userId: userDB.userId,
        username: userDB.username,
        displayName: userDB.displayName,
        image: userDB.image,
        type: userDB.type
      });
      res.status(200).json({ status: 'ok', message: 'User updated successfully.', token: token });
    }
  });
});

// GET /api/user/:userId/stats
userRouter.get('/:userId/stats', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql = `
      select
      xx.id,
          xx.userId,
          xx.imageURL,
          xx.name,
          CONCAT(scores, ",", xx.score) as scores
    from (SELECT
      ai.*,
      GROUP_CONCAT(
          COALESCE(scores.score, 'NaN')
          ORDER BY scores.n DESC
      ) AS scores
    FROM
      allstarImages AS ai
    LEFT JOIN (
      SELECT
          n,
          ai.id AS imageId,
          (
              SELECT
                  score
              FROM
                  allstarVoting AS av
              WHERE
                  DATE(av.timestamp) <= DATE(NOW()) - INTERVAL days.n DAY
                  AND av.imageId = ai.id
                  AND av.timestamp >= ai.last_update
              ORDER BY
                  av.timestamp DESC
              LIMIT 1
          ) AS score
      FROM (
          SELECT 1 AS n UNION ALL
          SELECT 2 UNION ALL
          SELECT 3 UNION ALL
          SELECT 4 UNION ALL
          SELECT 5 UNION ALL
          SELECT 6
      ) AS days,
      allstarImages AS ai
    ) AS scores ON ai.id = scores.imageId
    WHERE
      ai.userId = ?
    GROUP BY
      ai.id) as xx
  `;

  conn.query(sql, [+userId], (err: QueryError | null, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }

    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/user/:userId/images
userRouter.get('/:userId/images', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const sql = `
  select * from(
      SELECT
        ai.id as imageId,
        ai.imageURL,
        ai.name,
        ai.series_name,
        ai.score AS today_score,
        ai.userId,
        ai.description,
        DATE_FORMAT(ai.last_update, '%d/%m/%Y %H:%i:%s') AS last_update,
        RANK() OVER (ORDER BY ai.score DESC) AS today_rank,
        CASE
            WHEN DATE(ai.last_update) = CURDATE() THEN NULL
            ELSE COALESCE((SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1), ai.score)
        END AS yesterday_score,
        CASE
            WHEN DATE(ai.last_update) = CURDATE() THEN NULL
            ELSE RANK() OVER (ORDER BY COALESCE((SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1), ai.score) DESC)
        END AS yesterday_rank
      FROM
        allstarImages AS ai
      group by ai.id
      order by today_rank asc
    ) as subquery
    where subquery.userId = ?
  `;

  conn.query(sql, [userId], (err, result: OkPacket[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    res.status(200).json({ status: 'ok', data: result });
  });
});
