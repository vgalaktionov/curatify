#!/usr/bin/env bash

function deploy() {
    lein uberjar
    eval $(docker-machine env -u)
    docker-compose build
    docker-compose push
    eval $(docker-machine env curatify-do)
    docker-compose up -d --no-build
    eval $(docker-machine env -u)
}
