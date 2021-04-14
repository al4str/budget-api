#!/bin/bash

NAME=budget-api

cd "/var/www/${NAME}"

if ! docker volume inspect "${NAME}-volume"; then
  docker volume create "${NAME}-volume"
fi

git pull origin master

if docker ps | grep "${NAME}"; then
  docker rm -f "${NAME}"
fi

docker build -t "${NAME}-image" \
  -f ./deploy/Dockerfile \
  .

docker run \
  --name "${NAME}" \
  -p 4242:8080 \
  -v "${NAME}-volume":/usr/src/app/db \
  -d \
  "${NAME}-image"
