import express, { Request, Response } from 'express';
import { IMAGE_TABLE, conn, queryAsync } from '../config/dbconnect';
import { QueryError, ResultSetHeader } from 'mysql2';
import { ImageNewRequest } from '../model/image_new_req';
import { deleteFile, uploadFile } from '../utils/firebase';
import { FileMiddleware } from '../middleware/file_middleware';

export const imageRouter = express.Router();

// GET /api/image/:imageId
imageRouter.get('/random', async (req: Request, res: Response) => {
  const browserId: string = req.query.browserId as string;
  const userId: string = req.query.userId as string;

  let sql = `
    SELECT image.id, image.userId, image.imageURL, image.name, user.username, user.image as userImage, COUNT(voting.imageId) as voteCount
    FROM allstarImages image
    LEFT JOIN allstarUsers user
        ON user.userId = image.userId
    LEFT JOIN allstarVoting voting
        ON voting.imageId = image.id
    WHERE NOT EXISTS (
        SELECT 1 FROM allstarVoting
        WHERE imageId = image.id
        AND timestamp >= NOW() - INTERVAL (SELECT ASTime FROM allstarSettings limit 1) SECOND
        ${userId ? `AND userId = ${userId}` : browserId ? `AND browserId = '${browserId}'` : ''}
    )
    GROUP BY image.id
    ORDER BY RAND() * (COUNT(voting.imageId)+1) asc
    LIMIT 2
  `;

  conn.query(sql, (err: QueryError, result: ResultSetHeader) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/image/:imageId/stats
imageRouter.get('/:imageId/stats', (req: Request, res: Response) => {
  const imageId = req.params.imageId;
  const sql = `
      select
        xx.id,
        xx.userId,
        xx.imageURL,
        xx.name,
        CONCAT(scores, ",", xx.score) as scores,
        xx.today_score,
        xx.today_rank,
        xx.yesterday_score,
        xx.yesterday_rank,
        DATE_FORMAT(xx.last_update, '%d/%m/%Y %H:%i:%s') AS last_update
      from (SELECT
        ai.*,
        GROUP_CONCAT(
            COALESCE(scores.score, 'NaN')
            ORDER BY scores.n DESC
        ) AS scores,
        ai.score AS today_score,
        RANK() OVER (ORDER BY ai.score DESC) AS today_rank,
        (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) AS yesterday_score,
        RANK() OVER (ORDER BY (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) DESC) AS yesterday_rank
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
      GROUP BY ai.id) as xx
      where xx.id = ?
    `;
  conn.query(sql, [imageId], (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: err });
    }
    res.status(200).json({ status: 'ok', data: result[0] });
  });
});

// GET /api/image/top10
imageRouter.get('/top10', (req: Request, res: Response) => {
  const imageId = req.params.imageId;
  let sql = `
    SELECT
      ai.id as imageId,
      ai.imageURL,
      ai.name,
      ai.score AS today_score,
      RANK() OVER (ORDER BY ai.score DESC) AS today_rank,
      (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) AS yesterday_score,
      CASE
          WHEN DATE(ai.last_update) = CURDATE() THEN NULL
          ELSE RANK() OVER (ORDER BY (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) DESC)
      END AS yesterday_rank
    FROM
      allstarImages AS ai
    group by ai.id
    order by today_rank asc
    limit 10
  `

  conn.query(sql, [imageId], (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      // console.log(err)
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/image/ranks
imageRouter.get('/ranks', (req: Request, res: Response) => {
  let sql = `
    SELECT
      ai.id as imageId,
      ai.imageURL,
      ai.name,
      ai.score AS today_score,
      RANK() OVER (ORDER BY ai.score DESC) AS today_rank,
      (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) AS yesterday_score,
      CASE
          WHEN DATE(ai.last_update) = CURDATE() THEN NULL
          ELSE RANK() OVER (ORDER BY (SELECT av.score FROM allstarVoting AS av WHERE av.imageId = ai.id AND DATEDIFF(CURDATE(), av.timestamp) >= 1 ORDER BY av.timestamp DESC LIMIT 1) DESC)
      END AS yesterday_rank
    FROM
      allstarImages AS ai
    group by ai.id
    order by today_rank asc
  `

  conn.query(sql, (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', data: result });
  });
});

// GET /api/image/:id
imageRouter.get('/:id', (req: Request, res: Response) => {
  const imageId = req.params.id;
  let sql = `SELECT * FROM allstarImages WHERE id = ?`;

  conn.query(sql, [imageId], (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    res.status(200).json({ status: 'ok', data: result[0] });
  });
});

// DELETE /api/image/:id
imageRouter.delete('/:id', (req: Request, res: Response) => {
  const imageId = req.params.id;
  const { userId } = req.body;
  let sql = `DELETE FROM allstarImages WHERE id = ? and userId = ?`;

  conn.query(sql, [imageId, userId], async (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    // remove image from firebase
    const { status } = await deleteFile(imageId);
    if (status === 'error') {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }

    res.status(200).json({ status: 'ok', message: 'Image deleted' });
  });
});

// config multipart/form-data requests multer
const fileMiddleware = new FileMiddleware();

// PUT /api/image/:id
imageRouter.put('/:id', fileMiddleware.diskLoader.single('file'), async (req: Request, res: Response) => {
  const imageId = req.params.id;
  const { userId, name } = req.body;
  const file = req.file;

  // check own
  let sql = `SELECT * FROM allstarImages WHERE id = ? and userId = ?`;
  const imageDB: any = (await queryAsync(sql, [imageId, userId]));
  if (!imageDB) {
    return res
      .status(500)
      .json({ status: 'error', message: "NO OWN IMAGE" });
  }

  // if file
  let newImageURL: string | null = null
  if (file) {
    // upload
    const imageURL = await uploadFile(file);
    if (imageURL === null) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Upload Image ERROR' });
    }

    newImageURL = imageURL;

    // remove old image from firebase
    const { status } = await deleteFile(imageDB[0].imageURL);
    if (status !== 'ok') {
      return res
        .status(500)
        .json({ status: 'error', message: 'Delete Image ERROR' });
    }
  }

  // update image
  const data = {
    imageURL: file ? newImageURL : imageDB[0].imageURL,
    name: name,
  }

  sql = `UPDATE allstarImages SET imageURL = ?, name = ?, last_update = NOW() WHERE id = ?`;
  conn.query(sql, [data.imageURL, data.name, imageId], (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Update Image ERROR' });
    }
    res.status(200).json({ status: 'ok', message: 'Image updated' });
  });
});


// POST /api/image
imageRouter.post('/', fileMiddleware.diskLoader.single('file'), async (req: Request, res: Response) => {
  const image: ImageNewRequest = req.body;
  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid Input' });
  }

  // check user limit image
  let sql = `
  SELECT COUNT(*) as total, (select MaxImagePerUser from allstarSettings limit 1) as MaxImagePerUser
  FROM allstarImages
  where allstarImages.userId = ?`;

  let result: any = (await queryAsync(sql, [image.userId]));
  if (!result) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }

  if (result[0].total >= result[0].MaxImagePerUser) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Image limit reached' });
  }

  const imageURL = await uploadFile(file);
  if (imageURL === null) {
    return res
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  }

  sql = `INSERT INTO allstarImages (imageURL, name, userId, series_name) VALUES (?, ?, ?, ?)`;
  conn.query(sql, [imageURL, image.name, image.userId, image.series_name], (err: QueryError | null, result: ResultSetHeader[]) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Internal server error' });
    }
    res.status(200).json({ status: 'ok', message: 'Image created' });
  });

});
