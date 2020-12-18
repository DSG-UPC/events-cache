![CI/CD](https://github.com/DSG-UPC/events-cache/workflows/CI/CD/badge.svg?branch=deploy&event=push)

# events-cache

This repository contains three different things:

- ereports-postgres: a postgres database. Files are in [database folder](database).
- ereports-events: a service that subscribes to eReuse-Blockchain events and saves them to ereports-postgres. Files are in [events](events).
- ereports-api: an HTTP API that serves database content and manages stamps. Files can be found in [api](api).

## Install

Ereports-api and ereports-events are npm projects, which means they can be installed and executed following the conventional steps:

Inside one of the projects folders, run `npm install` to install the dependencies. Also, `cp .env.example .env` and fill the fields.

Refer to [database README](database/README.md) for instructions on how to set up the postgres database.

## Execution

Both ereports-api and ereports-events have development scripts in package.json.
Run `npm start` to execute a single time or `npm run dev` to reload every time a file changes.

## What does it do?

### Event subscription

This service subscribes to certain events from the eReuse blockchain. Their data is extracted and immediately inserted into the postgres database.

### API

A simple express API exposes some endpoints so an external application can easily get device and user data.
