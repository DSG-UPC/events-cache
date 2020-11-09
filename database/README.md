# Installing the database
Simply run: `docker-compose up -d`

# Connecting to the database
The postgres container is set up at 127.0.0.1:5432. Thus, you can connect by running `psql -h 127.0.0.1 -U postgres`

# Reinstalling database
Remember to run `docker-compose build` if you modify setup.sh.
