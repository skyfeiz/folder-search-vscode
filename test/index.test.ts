import * as path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { getFolderList } from '../src/utils';
import { createTestFolder, deleteTestFolder, TEMP_FOLDER } from './mockFolders';

// create the test folders before the tests
createTestFolder();

describe('should', () => {
  const alias = { '@': TEMP_FOLDER };
  let searchPaths = [];

  it('@/*/*', () => {
    searchPaths = ['@/*/*'];

    const folderList = getFolderList(alias, searchPaths);
    const target = [
      { name: 'aaa', path: path.join(TEMP_FOLDER, 'test1', 'aaa') },
      { name: 'bbb', path: path.join(TEMP_FOLDER, 'test1', 'bbb') },
      { name: 'aaa', path: path.join(TEMP_FOLDER, 'test2', 'aaa') },
      { name: 'bbb', path: path.join(TEMP_FOLDER, 'test2', 'bbb') },
      { name: 'ccc', path: path.join(TEMP_FOLDER, 'test3', 'ccc') },
    ];

    expect(folderList).toEqual(target);
  });

  it('@/*/aaa/*', () => {
    searchPaths = ['@/*/aaa/*'];

    const folderList = getFolderList(alias, searchPaths);
    const target = [
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test1', 'aaa', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test1', 'aaa', 'project2') },
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test2', 'aaa', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test2', 'aaa', 'project2') },
    ];

    expect(folderList).toEqual(target);
  });

  it('@/*/*/*', () => {
    searchPaths = ['@/*/*/*'];

    const folderList = getFolderList(alias, searchPaths);
    const target = [
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test1', 'aaa', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test1', 'aaa', 'project2') },
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test1', 'bbb', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test1', 'bbb', 'project2') },
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test2', 'aaa', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test2', 'aaa', 'project2') },
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test2', 'bbb', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test2', 'bbb', 'project2') },
      { name: 'project1', path: path.join(TEMP_FOLDER, 'test3', 'ccc', 'project1') },
      { name: 'project2', path: path.join(TEMP_FOLDER, 'test3', 'ccc', 'project2') },
    ];

    expect(folderList).toEqual(target);
  });

  // delete the test folders after the tests
  afterAll(() => {
    deleteTestFolder();
  });
});
