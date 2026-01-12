import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineExtension } from 'reactive-vscode';
import { commands, Uri, window as vscodeWindow, workspace } from 'vscode';

interface FolderItem {
  name: string
  path: string
}

const { activate, deactivate } = defineExtension((context) => {
  const disposable = commands.registerCommand('search-folder.openSearchPanel', () => {
    const alias = workspace.getConfiguration('folder-search').get<Record<string, string>>('alias') || {};

    let basePaths = workspace.getConfiguration('folder-search').get<string[]>('searchPaths') || [];

    Object.entries(alias).forEach(([key, value]) => {
      basePaths = basePaths.map(basePath => basePath.replace(key, value));
    });

    if (!basePaths || basePaths.length === 0)
      return;

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

    // create the quick pick items
    const items: QuickPickItem[] = folderList.map(folder => ({
      label: folder.name,
      // description: folder.path,
      detail: folder.path,
    }));

    // show the quick pick, support input filtering
    vscodeWindow
      .showQuickPick(items, {
        placeHolder: 'Search for folder...',
        matchOnDescription: true,
        matchOnDetail: true,
      })
      .then((selected) => {
        if (selected) {
          // find the corresponding folder path
          const folder = folderList.find(f => f.path === selected.detail);
          if (folder) {
            const folderUri = Uri.file(folder.path);

            // check if the folder exists
            if (fs.existsSync(folder.path)) {
              // open the folder
              commands.executeCommand('vscode.openFolder', folderUri, false).then(
                () => {
                  // eslint-disable-next-line no-console
                  console.log(`opened folder: ${folder.name} - ${folder.path}`);
                },
                (error: any) => {
                  console.error('failed to open folder:', error);
                  vscodeWindow.showErrorMessage(`failed to open folder: ${error?.message || String(error)}`);
                },
              );
            } else {
              vscodeWindow.showErrorMessage(`folder not found: ${folder.path}`);
            }
          }
        }
      });
  });

  context.subscriptions.push(disposable);
});

/**
 * Scan the first-level folders under the specified path
 */
function scanFoldersInPath(basePath: string): FolderItem[] {
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

export { activate, deactivate };
