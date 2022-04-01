import { ApiService } from './api.service';
import JSZip from 'jszip';
import * as fs from 'fs';
import { blobZipFile } from '../utils/file.util';

class GithubService {
  private readonly _api = new ApiService('https://api.github.com');
  private readonly _uploadApi = new ApiService('https://uploads.github.com');
  private readonly _endpoint = {
    createRelease:
      '/repos/Storware/ovirt-engine-ui-vprotect-extensions/releases',
    pushPackages:
      '/repos/Storware/ovirt-engine-ui-vprotect-extensions/releases/{release_id}/assets',
  };

  createRelease({ tag = '', branch = 'master', draft = true }): Promise<any> {
    const body = {
      name: `v${tag}`,
      tag_name: tag,
      target_commitish: branch,
      draft,
    };

    return this._api.post(this._endpoint.createRelease, body);
  }

  uploadPackages(id: string, filePath: string) /*: Promise<any>*/ {
    const input = blobZipFile(filePath);

    this._uploadApi.post(
      this._setParams(
        `${this._endpoint.pushPackages}?name=openstack-blob33.zip`,
        {
          release_id: id,
        },
      ),
      input,
    );

    // fs.readFile(filePath, (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   JSZip.loadAsync(data).then((zip) => {
    //     this._uploadApi.post(
    //       this._setParams(`${this._endpoint.pushPackages}?name=openstack.zip`, {
    //         release_id: id,
    //       }),
    //       zip,
    //     );
    //   });
    // });
    // return;
  }

  private _setParams(url: string, params: any): string {
    return url.replace(/{(.*?)}/g, (_, key) => params[key]);
  }

  upload(files) {
    const zip = new JSZip();
    const archive = zip.folder('test');

    files.map(
      // tslint:disable-next-line:only-arrow-functions
      function (file) {
        files.file(file.name, file.raw, { base64: true });
      }.bind(this),
    );

    return archive
      .generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6,
        },
      })
      .then((content) => {
        // send to server or whatever operation
      });
  }
}

export default new GithubService();
