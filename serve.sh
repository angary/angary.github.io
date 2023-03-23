#!/bin/sh

BUILD_DIR="out"

if [[ $(git status -s) ]]
then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi

echo "Deleting old publication"
rm -rf $BUILD_DIR
mkdir $BUILD_DIR
git worktree prune
rm -rf .git/worktrees/$BUILD_DIR/

echo "Checking out gh-pages branch into $BUILD_DIR"
git worktree add -B gh-pages $BUILD_DIR gh-pages

echo "Removing existing files"
rm -rf $BUILD_DIR/*

echo "Generating site"
yarn export

echo "Adding CNAME"
cat CNAME >> $BUILD_DIR/CNAME

echo "Updating gh-pages branch"
cd $BUILD_DIR
git add --all
git commit -m "Publishing to gh-pages (serve.sh)"
git push
