#!/usr/bin/env bash
eval $(docker-machine env -u)
docker-compose build
docker-compose push
eval $(docker-machine env curatify-do)
docker-compose pull
docker-compose up -d --no-build
eval $(docker-machine env -u)
