import * as fs from 'fs';
import * as path from 'path';

function createPathIfNotExists(targetPath: string): void {
  const absolutePath = path.resolve(targetPath);

  try {
    // Check if the path already exists
    fs.accessSync(absolutePath);
  } catch (error) {
    // If the path doesn't exist, create it
    fs.mkdirSync(absolutePath, { recursive: true });
  }
}

export default createPathIfNotExists;
