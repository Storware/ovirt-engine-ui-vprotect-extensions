import shell from 'shelljs';

export const commitChangedFiles = (commitMessage) => {
  ['git add .', `git commit -m\"${commitMessage}\"`].forEach((command) =>
    shell.exec(command),
  );
};

export const releaseVersion = (version) => {
  commitChangedFiles(`Release version ${version}`);
  [`git tag ${version}`].forEach((command) => shell.exec(command));
};
