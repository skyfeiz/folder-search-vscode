import type { FolderItem } from './type';
import * as fs from 'node:fs';
import * as path from 'node:path';
import fg from 'fast-glob';

export function getFolderList(alias: Record<string, string>, basePaths: string[]): FolderItem[] {
  Object.entries(alias).forEach(([key, value]) => {
    basePaths = basePaths.map((basePath) => {
      // replace @ to the alias value
      basePath = basePath.replace(key, value);
      // replace ** to *
      basePath = basePath.replace(/\*+/g, '*');

      basePath = basePath.replace(/\\/g, '/');

      return basePath;
    });
  });

  if (!basePaths || basePaths.length === 0)
    return [];

  const folders = fg.sync(basePaths, {
    onlyDirectories: true,
  });

  const folderList: FolderItem[] = [];

  folders.forEach((folder) => {
    folderList.push({ name: folder.split('/').pop()!, path: folder });
  });

  return folderList;
}

/**
 * Scan the first-level folders under the specified path
 */
export function scanFoldersInPath(basePath: string): FolderItem[] {
  const folders: FolderItem[] = [];

  if (!fs.existsSync(basePath)) {
    console.warn(`path not found: ${basePath}`);
    return folders;
  }

  try {
    const items = fs.readdirSync(basePath);
    items.forEach((item) => {
      const itemPath = path.join(basePath, item);
      try {
        const stat = fs.statSync(itemPath);
        if (stat.isDirectory()) {
          folders.push({ name: item, path: itemPath });
        }
      } catch (error) {
        console.warn(`failed to read ${itemPath}:`, error);
      }
    });
  } catch (error) {
    console.error(`failed to scan path ${basePath}:`, error);
  }

  return folders;
}
