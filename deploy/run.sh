#!/bin/bash

git pull origin master
docker build -f /var/www/budget-api/deploy/Dockerfile -t "budget-api-image"
docker run -p 4242:8080 -u "node" --memory-swap "1G" --mount source=budget-api-volume,target=/usr/src/app/db --name "budget-api" -d "budget-api-image"
