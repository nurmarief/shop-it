import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import cloudinary from 'cloudinary';
import { setupDotenv } from './dotenv.js';

const __filename = fileURLToPath(import.meta.url); // Get the resolved and decode path to the file
export const __dirname = dirname(__filename); // Get the name of the directory

setupDotenv([__dirname, '..', 'config', 'config.env']);

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file, folder) => {
  const cloudinaryOptions = {
    resource_type: 'auto',
    folder,
  }
  const result = await cloudinary.v2.uploader.upload(file, cloudinaryOptions);

  return {
    public_id: result.public_id,
    url: result.url,
  }
}

export const deleteFile = async (file) => {
  const result = await cloudinary.v2.uploader.destroy(file);
  if (result?.result === 'ok') return true;
}
