#!/bin/bash

FOLDER_NAME="`basename $(pwd)`"
DEST_NAME="west-house-middleware"

echo "Preparing to clone"

sudo rm -rf /tmp/$DEST_NAME
sudo rm -rf /tmp/_$DEST_NAME

cd ..

echo "Copying this source code to temporary directory"

sudo cp -r `pwd`/$FOLDER_NAME /tmp/$DEST_NAME
cd /tmp

echo "Downloading remote build"

git clone ssh://westhouse@west-house.no-ip.org/~/repositories/$DEST_NAME.git _$DEST_NAME

sudo rm -rf $DEST_NAME/.git
sudo mv _$DEST_NAME/.git $DEST_NAME

cd $DEST_NAME

echo "Commiting changes to the downloaded repo."

git add -A
git commit -am "Update."

echo "Pushing."

git push origin master