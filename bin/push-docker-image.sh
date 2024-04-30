#!/usr/bin/env bash

if [[ $# -eq 0 ]] ; then
    echo "Missing argument of new version"
    exit 1
fi

VERSION=$1
SERIES=${VERSION:0:4}-latest

docker push chesspro13/trilium:$VERSION
docker push chesspro13/trilium:$SERIES

if [[ $1 != *"beta"* ]]; then
  docker push chesspro13/trilium:latest
fi
