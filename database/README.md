# Installing the database and pgadmin
Simply run: `docker-compose up -d`

## Connecting to the database
Docker creates an internal network shared between the docker images and the host.

Running `docker network ls` will give you the hostname of that network, in my case "database_postgres". Then, running `docker network inspect database_postgres` gives you the IPs and hostnames assigned to each endpoint.

Next commands should print the postgres ip.
```bash
a=`sudo docker network inspect database_postgres | grep database_db_1 -A 3 | tail -1 | cut -d ":" -f 2` && b="${a%\/*}" && echo "${b#*\"}"
```

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
