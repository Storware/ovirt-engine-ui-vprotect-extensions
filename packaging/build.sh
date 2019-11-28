#!/bin/bash -ex

# Name and version of the package:
tar_version="${tar_version:=0.0.0}"
tar_file="${tar_file:=ovirt-engine-ui-extensions-${tar_version}.tar.gz}"
rpm_version="${rpm_version:=${tar_version}}"
rpm_snapshot="${rpm_snapshot:=}"
rpm_dist="${rpm_dist:=$(rpm --eval '%dist')}"

# Generate the .spec file from the template for the distribution where
# the build process is running:
spec_template=$(test -e "spec${rpm_dist}.in" && echo "spec${rpm_dist}.in" || echo "spec.in")
spec_file="ovirt-engine-ui-extensions.spec"
sed \
  -e "s|@RPM_VERSION@|${rpm_version}|g" \
  -e "s|@RPM_SNAPSHOT@|${rpm_snapshot}|g" \
  -e "s|@TAR_FILE@|${tar_file}|g" \
  < "${spec_template}" \
  > "${spec_file}" \

# Download the sources:
spectool \
  --get-files \
  "${spec_file}"

# Build the source and binary .rpm files:
rpmbuild \
  -ba \
  --define="_sourcedir ${PWD}" \
  --define="_rpmdir ${PWD}" \
  --define="_srcrpmdir ${PWD}" \
  "${spec_file}"
