import multer, { Multer } from 'multer';

export class FileMiddleware {
  // fileName
  public fileName: string = '';

  // Create Object File Multer
  public readonly diskLoader: Multer = multer({
    // storage
    storage: multer.memoryStorage(),
    // file size
    limits: {
      fileSize: 2 * 1024 * 1024, // no larger than 2mb
    },
  });
}
