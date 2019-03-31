#!/usr/bin/env bash
eval $(docker-machine env -u)
docker-compose build
docker-compose push
eval $(docker-machine env curatify-do)
docker-compose pull
docker-compose up -d --no-build
eval $(docker-machine env -u)

# to create a new droplet, run: docker-machine create --driver digitalocean --digitalocean-access-token=$DO_TOKEN --digitalocean-region=ams3 curatify-do
