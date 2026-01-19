import type { FolderItem } from './type';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function getFolderList(alias: Record<string, string>, basePaths: string[]): FolderItem[] {
  Object.entries(alias).forEach(([key, value]) => {
    basePaths = basePaths.map(basePath => basePath.replace(key, value));
  });

  if (!basePaths || basePaths.length === 0)
    return [];

  const folderList: FolderItem[] = [];

  basePaths.forEach((basePath) => {
    let folders: FolderItem[] = [];
    // whether the path has '*', '**' will be converted to '*'
    if (basePath.includes('*')) {
      basePath = basePath.replace(/\*+/g, '*');
      // /a/b/*/c/d  ->  ['/a/b/', '/c/d']
      const pathParts = basePath.split('*');

      let tempFolders: FolderItem[] = [{ name: '', path: '' }];

      while (pathParts.length > 0) {
        const part = pathParts.shift()!;

        const newTempPaths: FolderItem[] = [];

        tempFolders.forEach((tempPath) => {
          const newPath = path.join(tempPath.path, part);
          if (fs.existsSync(newPath)) {
            const tempFolders = scanFoldersInPath(newPath);
            newTempPaths.push(...tempFolders);
          }
        });

        tempFolders = newTempPaths;
      }
      folders = tempFolders;
    } else {
      folders = scanFoldersInPath(basePath);
    }
    folderList.push(...folders);
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
