#!/bin/bash

FOLDER_NAME="`basename $(pwd)`"
DEST_NAME="west-house-middleware"
THIS_DIR=`pwd`

echo "Deleting .deploy"
sudo rm -rf /tmp/.deploy

echo "Does a .deploy folder exist?"
if [ ! -d .deploy/$DEST_NAME/.git ]; then
  echo "No"
  echo "Creating a .deploy folder in /tmp"
  mkdir /tmp/.deploy
  cd /tmp/.deploy
  echo "Cloning the remote repository into /tmp/.deploy/$DEST_NAME"
  git clone ssh://westhouse@west-house.no-ip.org/~/repositories/$DEST_NAME.git
  cd $THIS_DIR
  echo "Moving the cloned folder to ./.deploy"
  sudo mv /tmp/.deploy .
else
  echo "Yes"
fi

echo "Moving the .deploy folder to /tmp"
sudo mv .deploy /tmp

cd /tmp/.deploy

echo "Moving the .git folder from /tmp/.deploy/$DEST_NAME"
sudo mv $DEST_NAME/.git .
echo "Deleting $DEST_NAME from /tmp/.deploy"
sudo rm -rf $DEST_NAME
echo "Copying the source code to here"
sudo cp -r $THIS_DIR ./west-house-middleware
echo "Deleting the source's .git"
sudo rm -rf $DEST_NAME/.git
echo "Deleting the source's .gitignore"
sudo rm -rf $DEST_NAME/.gitignore
echo "Deleting the source's .deploy"
sudo rm -rf $DEST_NAME/.deploy
echo "Moving the .git to /tmp/.deploy/$DEST_NAME"
sudo mv .git $DEST_NAME

cd $THIS_DIR
echo "Deleting this directory's deploy folder."
sudo rm -rf .deploy
echo "Copying the deployment folder from /tmp"
sudo cp -r /tmp/.deploy .
cd .deploy/$DEST_NAME
sudo rm -f .git/index.lock

echo "Committing the code in deploy"
sudo git add -A
sudo git commit -am "Update."
sudo git push origin master