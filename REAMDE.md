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