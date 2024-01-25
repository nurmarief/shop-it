import { join } from 'node:path';
import dotenv from 'dotenv';

export const setupDotenv = (path) => {
  const DOTENV_CONFIG_PATH = join(...path);
  dotenv.config({ path: DOTENV_CONFIG_PATH });
}
