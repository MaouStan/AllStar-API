import fs from 'fs';
import path from 'path';

const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomNum = Math.round(Math.random() * 10000);
  return `${timestamp}-${randomNum}-${originalName}`;
};

export const uploadFile = async (file: Express.Multer.File) => {
  const fileName = generateUniqueFileName(file.originalname);
  const filePath = path.join(__dirname, '..', '..', 'public', 'images', fileName);
  
  try {
    await fs.promises.writeFile(filePath, file.buffer);
    const url = `http://localhost:3500/images/${fileName}`;
    return url;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteFile = async (fileUrl: string) => {
  const fileName = fileUrl.split('/').pop();
  const filePath = path.join(__dirname, '..', '..', 'public', 'images', fileName || '');
  
  try {
    await fs.promises.unlink(filePath);
    return {
      status: 'ok',
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'delete error' };
  }
};

export const checkFileExists = async (fileUrl: string): Promise<boolean> => {
  const fileName = fileUrl.split('/').pop();
  const filePath = path.join(__dirname, '..', '..', 'public', 'images', fileName || '');
  
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch (error) {
    return false; // File does not exist
  }
};
