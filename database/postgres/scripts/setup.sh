#!/usr/bin/env bash

# $DB is the database to create
# $USER is the user to create and give full permissions on the database
DB="metrics"
USER="postgres"
PASS="postgres"

# read -s -p "PASSword for $USER": PASS
createdb $DB 
# psql -d $DB -c "CREATE USER $USER WITH PASSWORD '$PASS';"
psql -d $DB -c "GRANT ALL PRIVILEGES ON DATABASE $DB TO $USER;"
# psql -d $DB -c "CREATE EXTENSION pgcrypto SCHEMA public;" # Enable pgcrypto
# psql -d $DB -c "CREATE EXTENSION ltree SCHEMA public;" # Enable ltree
# psql -d $DB -c "CREATE EXTENSION citext SCHEMA public;" # Enable citext
# psql -d $DB -c "CREATE EXTENSION pg_trgm SCHEMA public;" # Enable pg_trgm

# psql -d $DB -c "CREATE TABLE Stamps (
#         hash        varchar(64),
#         timestamp   integer
#     );"

# psql -d $DB -c "CREATE TABLE Users (
#         address         varchar(40) PRIMARY KEY
#     );"

# psql -d $DB -c "CREATE TABLE Devices (
#         address         varchar(40) PRIMARY KEY
#     );"

psql -d $DB -c "CREATE TABLE RecycleProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        userAddress     char(40),
        deviceAddress   char(40),
        block           integer
    );"

psql -d $DB -c "CREATE TABLE FunctionProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        userAddress     char(40),
        deviceAddress   char(40),
        score           integer,
        diskUsage       integer,
        algorithmVersion TEXT,
        block           integer
    );"
        # FOREIGN KEY (userAddress) REFERENCES Users(address),
        # FOREIGN KEY (deviceAddress) REFERENCES Devices(address)

psql -d $DB -c "CREATE TABLE TransferProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        supplierAddress char(40),
        receiverAddress char(40),
        deviceAddress   char(40),
        block           integer
    );"

psql -d $DB -c "CREATE TABLE DataWipeProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        userAddress     char(40),
        deviceAddress   char(40),
        erasureType     TEXT,
        erasureResult   TEXT,
        block           integer
    );"

psql -d $DB -c "CREATE TABLE ReuseProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        userAddress     char(40),     
        deviceAddress   char(40),
        receiverSegment TEXT,
        idReceipt       TEXT,
        price           integer,
        block           integer
    );"




