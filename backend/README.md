## Building docker image


## Manually running container (would need to use host networking if running dockerised mongo locally)

```
## Host networking flag ' --network host ' is required if you wish to use a local mongo instance on the host 
docker run -p 8000:8000 -e MONGO_ROOT_USER=testUser -e MONGO_ROOT_PASSWORD=testPassword -e MONGO_PORT=27017 -e MONGO_HOST=127.0.0.1 ts-express-tdd-docker-nginx:0.0.1
```

## Interfactive running (useful for troubleshooting problems)

```
# From a terminal on the host machine
docker run --network host --interactive --tty --entrypoint /bin/sh <containerName>

# From a terminal on the container
MONGO_ROOT_USER=testUser MONGO_ROOT_PASSWORD=testPassword MONGO_PORT=27017 MONGO_HOST=127.0.0.1 node dist/index.js
``` 