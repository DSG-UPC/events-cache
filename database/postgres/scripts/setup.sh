#!/usr/bin/env bash

# $DB is the database to create
# $USER is the user to create and give full permissions on the database
DB="metrics"
USER="postgres"
PASS="postgres"


# read -s -p "PASSword for $USER": PASS
createdb $DB  # Create main database
psql -d $DB -c "CREATE USER $USER WITH PASSWORD '$PASS';"
psql -d $DB -c "GRANT ALL PRIVILEGES ON DATABASE $DB TO $USER;" # Give access to the db
# psql -d $DB -c "CREATE EXTENSION pgcrypto SCHEMA public;" # Enable pgcrypto
# psql -d $DB -c "CREATE EXTENSION ltree SCHEMA public;" # Enable ltree
# psql -d $DB -c "CREATE EXTENSION citext SCHEMA public;" # Enable citext
# psql -d $DB -c "CREATE EXTENSION pg_trgm SCHEMA public;" # Enable pg_trgm

psql -d $DB -c "CREATE TABLE Stamps (
        id          integer PRIMARY KEY,
        hash        varchar(64),
        timestamp   integer
    );"

psql -d $DB -c "CREATE TABLE Users (
        address         varchar(42) PRIMARY KEY
    );"

psql -d $DB -c "CREATE TABLE UserRecycledDevice (
        id              SERIAL PRIMARY KEY,
        userAddress     varchar(42),
        deviceAddress   varchar(42),
        FOREIGN KEY (userAddress) REFERENCES Users(address),
        FOREIGN KEY (deviceAddress) REFERENCES Devices(address)
    );"

psql -d $DB -c "CREATE TABLE Devices (
        address         varchar(42) PRIMARY KEY,
        firstUsageHours integer,
        lastUsageHours  integer,
        reuseProofs     varchar(42)[],
        recycleProofs   varchar(42)[],
        dataWipeProofs  varchar(42)[]
    );"


