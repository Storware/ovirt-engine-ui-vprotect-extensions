// grab some info from git on the state of the repo
const git = require('isomorphic-git');
const fs = require('fs');
git.plugins.set('fs', fs);

async function fetchGitInfo() {
  try {
    // https://isomorphic-git.org/docs/en/statusMatrix
    const fileStatus = (await git.statusMatrix({ dir: '.' })).reduce(
      (fs, file) => {
        fs.push({
          file: file[0],
          untracked: file[1] === 0 && file[2] === 2 && file[3] === 0,
          unmodified: file[1] === 1 && file[2] === 1 && file[3] === 1,
          staged:
            file[3] === 2 ||
            file[3] === 3 ||
            (file[1] === 1 && file[2] === 0 && file[3] === 0),
          modified: file[1] === 1 && file[2] === 2,
          deleted: file[1] === 1 && file[2] === 0,
          added: file[1] === 0 && file[2] === 2 && file[3] !== 0,
        });
        return fs;
      },
      [],
    );

    const [head] = await git.log({ dir: '.', depth: 1 });

    return {
      headOid: head.oid.substr(0, 8),
      hasChanges:
        fileStatus.length !==
        fileStatus.filter((status) => status.unmodified).length,

      untracked: fileStatus.filter((status) => status.untracked).length,
      staged: fileStatus.filter((status) => status.staged).length,
      added: fileStatus.filter((status) => status.added).length,
      modified: fileStatus.filter((status) => status.modified).length,
      deleted: fileStatus.filter((status) => status.deleted).length,
    };
  } catch (e) {
    return false;
  }
}

module.exports = fetchGitInfo;
