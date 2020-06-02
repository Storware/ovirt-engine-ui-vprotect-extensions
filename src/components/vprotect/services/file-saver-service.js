import * as FileSaver from 'file-saver'

class FileSaverService {
  async saveFile (data) {
    let contentDisposition = data.headers.get('content-disposition') || ''

    let matches = /filename=([^;]+)/ig.exec(contentDisposition)
    let fileName = contentDisposition === '' ? 'untitled' : (matches[1] || 'untitled').trim()

    if (fileName.startsWith('_')) {
      fileName = fileName.slice(1)
    }
    if (fileName.endsWith('_')) {
      fileName = fileName.slice(0, fileName.length - 1)
    }

    let blob = new Blob([await data.blob()], {
      type: 'application/octet-stream'
    })

    FileSaver.saveAs(blob, fileName)
  }
}

export const fileSaverService = new FileSaverService()
