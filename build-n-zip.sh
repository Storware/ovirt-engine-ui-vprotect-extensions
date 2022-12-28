#!/bin/bash

echo -e "\033[1;33mScript will execute 'git reset --hard' on both branches. Cancel and stash changes if you don't want to lose them. \033[0m"
read -p "Have you already updated version numbers in remote branches (master/develop)? (y/n) " yn

case $yn in
	[yY] ) break;;
	[nN] ) echo cancelling...;
		exit;;
	* ) echo invalid response;
		exit 1;;
esac
	
mkdir ./dist/5.0.0
mkdir ./dist/5.1.0
echo "Directories in ./dist created."
git checkout master
echo "branch master..."
git reset --hard
git pull
version=`jq -r '.version' package.json`
git tag $version
echo "building zips for 5.0.0"
npm run build-n-zip
echo "5.0.0 version built, moving .zip to ./dist/5.0.0 directory"
mv ./dist/openstack/openstack.zip ./dist/5.0.0
mv ./dist/oVirt/oVirt.zip ./dist/5.0.0
rm -rf ./dist/openstack
rm -rf ./dist/oVirt
git checkout develop
echo "branch develop..."
git reset --hard
git pull
version=`jq -r '.version' package.json`
git tag $version
echo "building zips for 5.1.0"
npm run build-n-zip
echo "5.1.0 version built, moving .zip to ./dist/5.1.0 directory"
mv ./dist/openstack/openstack.zip ./dist/5.1.0
mv ./dist/oVirt/oVirt.zip ./dist/5.1.0
rm -rf ./dist/openstack
rm -rf ./dist/oVirt
echo "pushing tags..."
git push origin --tags
echo "Finished. Check ./dist folder for files."

