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

# psql -d $DB -c "CREATE TABLE Users (
#         address         varchar(42) PRIMARY KEY
#     );"

# psql -d $DB -c "CREATE TABLE Devices (
#         address         varchar(42) PRIMARY KEY
#     );"

psql -d $DB -c "CREATE TABLE RecycleProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        recyclerAddress     char(42),
        deviceAddress   char(42),
        proofHash       char(32),
        date            TEXT,
        gpsLocation     TEXT
    );"
        # FOREIGN KEY (userAddress) REFERENCES Users(address),
        # FOREIGN KEY (deviceAddress) REFERENCES Devices(address)

psql -d $DB -c "CREATE TABLE FunctionProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        userAddress     varchar(42),
        deviceAddress   varchar(42),
        proofHash       varchar(32),
        score           integer,
        diskUsage       integer,
        algorithmVersion TEXT
    );"
        # FOREIGN KEY (userAddress) REFERENCES Users(address),
        # FOREIGN KEY (deviceAddress) REFERENCES Devices(address)

psql -d $DB -c "CREATE TABLE TransferProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        supplierAddress char(42),
        receiverAddress char(42),
        deviceAddress   char(42),
        proofHash       char(32)
    );"
        # FOREIGN KEY (supplierAddress) REFERENCES Users(address),
        # FOREIGN KEY (receiverAddress) REFERENCES Users(address),
        # FOREIGN KEY (deviceAddress) REFERENCES Devices(address)

psql -d $DB -c "CREATE TABLE DataWipeProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,     
        proofHash       char(32),
        deviceAddress   char(42),
        erasureType     TEXT,
        date            TEXT,
        erasureResult   TEXT
    );"

psql -d $DB -c "CREATE TABLE ReuseProofs (
        id              integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,     
        proofHash       char(32),
        deviceAddress   char(42),
        receiverSegment TEXT,
        idReceipt       TEXT,
        price           integer
    );"




