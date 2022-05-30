import * as FileSaver from 'file-saver';

class FileSaverService {
  async saveFile(data) {
    const contentDisposition = data.headers.get('content-disposition') || '';

    const matches = /filename=([^;]+)/gi.exec(contentDisposition);
    let fileName =
      contentDisposition === ''
        ? 'untitled'
        : (matches[1] || 'untitled').trim();

    if (fileName.startsWith('_')) {
      fileName = fileName.slice(1);
    }
    if (fileName.endsWith('_')) {
      fileName = fileName.slice(0, fileName.length - 1);
    }

    const blob = new Blob([await data.blob()], {
      type: 'application/octet-stream',
    });

    FileSaver.saveAs(blob, fileName);
  }
}

export const fileSaverService = new FileSaverService();
