# scdb-viewer

```
  docker compose up -d
```

<!-- ```
docker build -t go-env .
docker run -d -p 8000:8000 --net=mms_web -v "$PWD:/app" --name viewer go-env
docker exec -it viewer sh
air
``` -->

### Destroying the Scylla Cluster
```
cd mms
docker-compose kill
docker-compose rm -f
```

## v0 roadmap
- Build a rest api to get all the basic cluster info
- Build a frontend to get and show the data (keyspaces, tables, rows, rf, cf)
- Make the session be initialized from the frontend app
- Make a "run query" api to execute queries from the frontend app
- Dockerize the app
- Build a desktop version


## links
cql docs [here](https://cassandra.apache.org/doc/latest/cassandra/cql/)