import readlineSync from 'readline-sync';
import githubService from './services/github.service';
// tslint:disable-next-line:no-var-requires
const path = require('path');

const pPath = path.join(path.resolve(__dirname, '../package.json'));
// tslint:disable-next-line:no-var-requires
const pJson = require(pPath);

const openstackZipPath = path.join(
  path.resolve(__dirname, '../dist/openstack/openstack.zip'),
);
const oVirtZipPath = path.join(
  path.resolve(__dirname, '../dist/oVirt/oVirt.zip'),
);

(async () => {
  const versionBump = readlineSync.question(
    `Provide the version to which the plugin will be upgraded. (Current version ${pJson.version}): `,
  );
  // replaceTextInFile(pPath, pJson.version, versionBump);
  // releaseVersion(versionBump);

  // const uploadedRelease = await githubService.createRelease({
  //   tag: versionBump,
  // });
  const uploadedRelease = { id: 63252451 };
  await githubService.uploadPackages(`${uploadedRelease.id}`, openstackZipPath);
  console.log(uploadedRelease.id);
})();
