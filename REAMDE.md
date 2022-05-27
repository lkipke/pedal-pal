# Pedal Pal

## Development

### Starting

To build all of the images and start the containers:
```bash
$ docker-compose up --build
```

To do the same and also force a db reset (note: this erases any data)
```bash
$ docker-compose up --build -e FORCE_DB_RESET=true
```

### Stopping

To tear down all of the containers but keep the volumes:
```bash
$ docker-compose down
```

And if you want to remove the volumes:
```bash
$ docker-compose down -v
```

### Accessing running containers

Query the running containers:
```bash
$ cd pedal-pal
$ docker ps -a
```

#### MySQL

Find the id of the running mysql container, then exec into it with a `mysql` command. The password is in your `.env` file.
```bash
$ docker exec -it pedal-pal-mysqldb-1 mysql -uroot -p
```

Or if you want to enter with bash:
```bash
$ docker exec -it pedal-pal-mysqldb-1 bash
$ mysql -uroot -p
```

Run commands to query the tables:
```
> use <value of MYSQL_DATABASE from .env>;
> show tables;
> describe <table name>;
```