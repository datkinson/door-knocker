# door-knocker
Knocks on doors (HTTP Endpoints) to see if anyone is there.

[![Build Status](https://travis-ci.com/datkinson/door-knocker.svg?branch=master)](https://travis-ci.com/datkinson/door-knocker)


### Quickstart

For a quickstart please use the provided `docker-compose.yml` file and just run:

`docker-compose up` to start up a development environment.

### Dependancies

`CouchDB` is used as the primary datastore in this application. https://couchdb.apache.org

### Running

You can configure the application to point at your CouchDB instance with the following environment variables:

| Name | Default |
|:-:|:-:|
| COUCHDB_HOST | localhost |
| COUCHDB_PORT | 5984 |
| COUCHDB_PROTOCOL | http |
| COUCHDB_USER | null |
| COUCHDB_PASSWORD | null |
