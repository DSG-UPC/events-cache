# Installing the database and pgadmin
Simply run: `docker-compose up -d`

## Connecting to the database
Docker creates an internal network shared between the docker images and the host.

Running `docker network ls` will give you the hostname of that network, in my case "database_postgres". Then, running `docker network inspect database_postgres` you get the IPs and hostnames assigned to each endpoint.

### Using psql
psql -h \<database IP> -U postgres

### Using pgadmin
Pgadmin listens on localhost:8000.

You can connect from pgadmin to postgres using these parameters:
- host: \<database hostname> (postgres_db_1)
- port: 5432
- user: postgres
- password: postgres

# Reinstalling database
Remember to run `docker-compose build` if you modify setup.sh.