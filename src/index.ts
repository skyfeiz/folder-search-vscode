import type { QuickPickItem } from 'vscode';
import type { FolderItem } from './type';
import * as fs from 'node:fs';
import { defineExtension } from 'reactive-vscode';
import { commands, Uri, window as vscodeWindow } from 'vscode';
import { config } from './config';
import { getFolderList } from './utils';

const { activate, deactivate } = defineExtension((context) => {
  const disposable = commands.registerCommand('search-folder.openSearchPanel', () => {
    // get the alias and search paths from the config
    const alias = config.alias as Record<string, string>;
    const basePaths = config.searchPaths;

    const folderList = getFolderList(alias, basePaths);
    // create the quick pick items
    const items: QuickPickItem[] = folderList.map(({ name, path }) => ({
      label: name,
      // description: path,
      detail: path,
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
          checkAndOpenFolder(folder);
        }
      });
  });

  context.subscriptions.push(disposable);
});

/**
 * check if the folder exists and open it
 */
function checkAndOpenFolder(folder: FolderItem | undefined) {
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

export { activate, deactivate };
