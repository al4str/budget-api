#!/bin/bash

cd /var/www/budget-api
git pull origin master
docker stop budget-api
docker rm budget-api
docker build -t budget-api-image -f ./deploy/Dockerfile .
docker run --name budget-api -p 4242:8080 -v budget-api-volume:/usr/src/app/db -d budget-api-image
