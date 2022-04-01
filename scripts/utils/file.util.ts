import * as fs from 'fs';
import JSZip from 'jszip';

// tslint:disable-next-line:no-var-requires
const Zip = require('adm-zip');
import { Blob } from 'buffer';

export const replaceTextInFile = (path, fileContent, newContent) =>
  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      throw err;
    }
    const newValue = data.replace(fileContent, newContent);

    fs.writeFile(path, newValue, 'utf-8', (writeErr) => {
      if (writeErr) {
        throw writeErr;
      }
      // tslint:disable-next-line:no-console
      console.info('The data in the file has been updated');
    });
  });

export const blobZipFile = (path) =>
  new Blob([fs.readFileSync(path)], {
    type: 'application/zip',
  });
