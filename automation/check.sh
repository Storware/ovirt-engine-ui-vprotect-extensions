#!/bin/sh -ex

# Force updating nodejs-modules so any pre-seed update to rpm wait is minimized
PACKAGER=$(command -v dnf >/dev/null 2>&1 && echo 'dnf' || echo 'yum')
REPOS=$(sed -e '/^#/d' -e '/^[ \t]*$/d' automation/build.repos | cut -f 1 -d ',' | paste -s -d,)

${PACKAGER} --disablerepo='*' --enablerepo="${REPOS}" clean metadata
${PACKAGER} -y install ovirt-engine-nodejs-modules

# Set up Node.js environment with dependencies linked to ./node_modules:
source /usr/share/ovirt-engine-nodejs-modules/setup-env.sh

# Verify that dependency versions (semver ranges) in package.json have
# matching resolutions in the yarn.lock file:
yarn check

# Lint code and run tests:
yarn test
