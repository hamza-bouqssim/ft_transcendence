## Make Commands

- `make build`: Build the Docker containers.
- `make up`: Start the Docker containers.
- `make down`: Stop and remove the Docker containers.
- `make bash-api`: Open a bash shell in the API container.
- `make bash-frontend`: Open a bash shell in the Frontend container.
- `make bash-postgres`: Open a bash shell in the PostgreSQL container.
- `make remove-images`: Remove all Docker images.
- `make remove-volumes`: Remove all Docker volumes.

### for windows
```
sed -i 's/\r$//' init.sh
```

### for prisma studio 

```
make bash-api
```

```
npx prisma studio
```
