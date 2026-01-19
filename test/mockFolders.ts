import * as fs from 'node:fs';
import * as path from 'node:path';

const TEST_FOLDER_NAME = '.temp';
export const TEMP_FOLDER = path.join(__dirname, TEST_FOLDER_NAME);

function createReadmeFile() {
  const readmeContent = `# ${TEST_FOLDER_NAME} is a test folder. 

- you can delete this file and run the test again.
  `;
  fs.writeFileSync(path.join(TEMP_FOLDER, 'README.md'), readmeContent);
}

export function createTestFolder() {
  const folders = [
    'test1/aaa/project1',
    'test1/aaa/project2',
    'test1/bbb/project1',
    'test1/bbb/project2',
    'test2/aaa/project1',
    'test2/aaa/project2',
    'test2/bbb/project1',
    'test2/bbb/project2',
    'test3/ccc/project1',
    'test3/ccc/project2',
  ];

  folders.forEach((folder) => {
    fs.mkdirSync(path.join(TEMP_FOLDER, folder), { recursive: true });
  });
  createReadmeFile();
}

export function deleteTestFolder() {
  fs.rmdirSync(TEMP_FOLDER, { recursive: true });
}
