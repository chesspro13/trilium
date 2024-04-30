#!/usr/bin/env bash

VERSION=`jq -r ".version" package.json`
SERIES=${VERSION:0:4}-latest

cat package.json | grep -v electron > server-package.json

sudo docker build -t chesspro13/trilium:$VERSION --network host -t chesspro13/trilium:$SERIES .

if [[ $VERSION != *"beta"* ]]; then
  sudo docker tag chesspro13/trilium:$VERSION chesspro13/trilium:latest
fi
