# events-cache
Service that subscribes to certain blockchain events and stores them in a database. On the other side, it exposes this data with a basic API.

## Install
Run `npm install` to install the dependencies. Also, `cp .env.example .env` and fill the fields with your postgres parameters.

Refer to [database README](database/README.md) for instructions on how to set up the postgres database.

## Execution
Run `npm start` to execute the service. Alternatively, run `npm run dev` to watch for changes in files.

## What it does?
### Event subscription
This service subscribes to several events from the eReuse blockchain. Their data is extracted and immediately inserted into the postgres database.

### API
An Express API exposes some endpoints so an external application can easily get device and user data.



