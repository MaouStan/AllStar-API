import { Response } from 'express'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../config/fireabase";

// Initial a firebase Storage
const storage = getStorage(app);

// Initial a reference to the storage service, which is used to create references in your storage bucket
const storageRef = ref(storage, 'images');

export const uploadFile = async (file: Express.Multer.File) => {
  const fileName = generateUniqueFileName(file.originalname);
  const fileBuffer = file.buffer;
  const fileRef = ref(storageRef, fileName);
  try {
    await uploadBytesResumable(fileRef, fileBuffer);
    const url = await getDownloadURL(fileRef);
    // res.status(200).json({
    //   status: 'ok',
    //   message: 'File uploaded successfully',
    //   data: {
    //     url: url,
    //   }
    // });
    return url;
  } catch (error) {
    console.error(error);
    // res
    //   .status(500)
    //   .json({ status: 'error', message: 'Internal server error' });
    return null
  }
};

export const deleteFile = async (fileUrl: string) => {

  const url = fileUrl.split('/');
  const filePath = url[url.length - 1].replace("%2F", "/");
  const fileRef = ref(storage, filePath.split("?")[0]);
  try {
    // check file exists
    if (await checkFileExists(fileUrl)) {
      await deleteObject(fileRef);
    }
    return {
      status: 'ok',
      message: 'File deleted successfully',
    };
  } catch (error) {
    // console.log(error)
    return { status: 'error', message: 'delete error' };
  };
}
export const checkFileExists = async (fileUrl: string): Promise<boolean> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await getDownloadURL(fileRef);
    return true; // File exists
  } catch (error) {
    return false; // File does not exist
  }
};

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomNum = Math.round(Math.random() * 10000);
  return `${timestamp}-${randomNum}-${originalName}`;
}
