#!/bin/bash

FOLDER_NAME="`basename $(pwd)`"
DEST_NAME="west-house-middleware"
THIS_DIR=`pwd`

rm -rf /tmp/.deploy

if [ ! -d .deploy/west-house-middleware/.git ]; then
  cd ..
  mkdir /tmp/.deploy
  cd /tmp/.deploy
  git clone ssh://westhouse@west-house.no-ip.org/~/repositories/$DEST_NAME.git
  cd $THIS_DIR
  sudo cp -r /tmp/.deploy .
fi

sudo mv .deploy /tmp

cd /tmp/.deploy

sudo mv $DEST_NAME/.git .
sudo rm -rf $DEST_NAME
sudo cp -r $THIS_DIR .
sudo rm -rf $DEST_NAME/.git
sudo mv .git /tmp/.deploy/$DEST_NAME

cd $THIS_DIR
rm -rf .deploy
cp -r /tmp/.deploy .
cd .deploy

git add -A
git commit -am "Update."

git push origin master