# Data API for Research Software Directory
[![TravisCIBadge](https://travis-ci.org/research-software-directory/backend.svg?branch=master)](https://travis-ci.org/research-software-directory/backend)
[![Coverage Status](https://coveralls.io/repos/github/research-software-directory/backend/badge.svg)](https://coveralls.io/github/research-software-directory/backend)

Data API for Research Software Directory
### Requirements:
- Python 3.6+ (or run through Docker)

### Setup:
- This service depends on the following services:
    -   MongoDB (3.6) (`docker pull mongo:3.6 && docker run -p 27017:27017 mongo:3.6`)


### Configuration:
- Configuration consists of two parts:
#### Environmental variables
```
JWT_SECRET=[hidden]                - JSON web token secret to generate/verify tokens]
DATABASE_HOST=localhost            - MongoDB host
DATABASE_PORT=27017                - MongoDB tcp port
DATABASE_NAME=rsd                  - MongoDB database to use
SCHEMAS_PATH=./schemas             - Path where the schema files can be found
```
#### Schema files
Schema files should be in `SCHEMAS_PATH`. See the directory `schemas_example`
for the schemas we use at the eScience Center.

### Run unit tests
```
mkvirtualenv data-api -p `which python3`
pip install -r requirements.txt
PYTHONPATH=`pwd` pytest
```

### Run API server
Make sure that your Python is up to date and requirements are installed (same as under unit tests).
Set environmental variables (eg. `export $(cat .env.example | xargs)`).
```
python entry.py                                                               # starts server
FLASK_APP=`pwd`/entry.py flask generate_jwt --sub test_user -p write -p read  # generates a JWT for read+write
```
Or run through Docker:
```
docker build -t rsd/backend .
docker run --env-file ./.env -p 5001:8000 -it --name rsd-backend rsd/backend
```

### Usage
# `GET /[resource_type]`

Get list of resources of type `resource_type`. Arguments:
- ```
  ?sort=[field]
  ?sort=[field.subfield]
  ```
  Sorts by field `field`

- ```
  ?direction=desc
  ```
  Sort descending (default is ascending)

- ```
  ?skip=[skip]&limit=[limit]
  ```
  Skip first `skip` records, show max `limit` results.

# `GET /[resource_type]/[id_or_slug]`
Returns record with `slug` or `primaryKey/id` of `id_or_slug`

# `POST /[resource_type](?test=1)`
Create a new record. Body should contain the contents in JSON format.
Argument `test=1` means it won't be really saved, just tested if it can be saved.
**Requires `write` permission, use `Authorization: Bearer [JWT]` header with a valid JWT with write permissions**.

# `PATCH /[resource_type]/[id_or_slug]`
Updates record. Body should contain the (partial) contents in JSON format.
A field is not modified if it is not set in the JSON body.
**Requires `write` permission.**
