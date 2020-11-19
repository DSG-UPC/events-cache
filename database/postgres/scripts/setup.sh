#!/usr/bin/env bash

DB="metrics"
USER="postgres"
PASS="postgres"

createdb $DB
# psql -d $DB -c "CREATE USER $USER WITH PASSWORD '$PASS';"
psql -d $DB -c "GRANT ALL PRIVILEGES ON DATABASE $DB TO $USER;"
# psql -d $DB -c "CREATE EXTENSION pgcrypto SCHEMA public;" # Enable pgcrypto
# psql -d $DB -c "CREATE EXTENSION ltree SCHEMA public;" # Enable ltree
# psql -d $DB -c "CREATE EXTENSION citext SCHEMA public;" # Enable citext
# psql -d $DB -c "CREATE EXTENSION pg_trgm SCHEMA public;" # Enable pg_trgm


# psql -d $DB -c "CREATE TABLE Users (
#         address         varchar(40) PRIMARY KEY
#     );"

psql -d $DB -c "CREATE TABLE Devices (
        address         char(40) PRIMARY KEY
    );"

psql -d $DB -c "CREATE TABLE RecycleProofs (
        block           integer not null,
        userAddress     char(40) not null,
        deviceAddress   char(40) not null,
        primary key(userAddress, deviceAddress, block),
        foreign key(deviceAddress) references Devices(address) on delete set null
    );"

psql -d $DB -c "CREATE TABLE FunctionProofs (
        block           integer not null,
        userAddress     char(40) not null,
        deviceAddress   char(40) not null,
        score           integer,
        diskUsage       integer,
        algorithmVersion TEXT,
        primary key(userAddress, deviceAddress, block),
        foreign key(deviceAddress) references Devices(address) on delete set null
    );"
        # FOREIGN KEY (userAddress) REFERENCES Users(address),
        # FOREIGN KEY (deviceAddress) REFERENCES Devices(address)

psql -d $DB -c "CREATE TABLE TransferProofs (
        block           integer not null,
        supplierAddress char(40) not null,
        receiverAddress char(40) not null,
        deviceAddress   char(40) not null,
        primary key(supplierAddress, receiverAddress, deviceAddress, block),
        foreign key(supplierAddress) references Devices(address) on delete set null,
        foreign key(receiverAddress) references Devices(address) on delete set null
    );"

psql -d $DB -c "CREATE TABLE DataWipeProofs (
        block           integer not null,
        userAddress     char(40) not null,
        deviceAddress   char(40) not null,
        erasureType     TEXT,
        erasureResult   TEXT,
        primary key(userAddress, deviceAddress, block),
        foreign key(deviceAddress) references Devices(address) on delete set null
    );"

psql -d $DB -c "CREATE TABLE ReuseProofs (
        block           integer not null,
        userAddress     char(40) not null,     
        deviceAddress   char(40) not null,
        receiverSegment TEXT,
        idReceipt       TEXT,
        price           integer,
        primary key(userAddress, deviceAddress, block),
        foreign key(deviceAddress) references Devices(address) on delete set null
    );"




