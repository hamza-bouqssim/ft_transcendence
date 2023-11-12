.PHONY: help
help:
	@echo "Available commands:"
	@echo "  build           - Build the Docker containers"
	@echo "  up              - Start the Docker containers"
	@echo "  down            - Stop and remove the Docker containers"
	@echo "  bash-api        - Open a bash in the API container"
	@echo "  bash-frontend   - Open a bash in the Frontend container"
	@echo "  bash-postgres   - Open a bash in the PostgreSQL container"
	@echo "  remove-images   - Remove all Images "
	@echo "  remove-volumes  - Remove all Volumes "
	@echo "  prune           - prune all"


build:
	docker-compose build

up:
	docker-compose up 

down:
	docker-compose down

bash-api:
	docker exec -it  nestJs bash

bash-frontend:
	docker exec  -it nextJs bash 

bash-postgres:
	docker exec -it  postgres bash

remove-images:
	docker-compose down --rmi all
remove-volumes:
	docker-compose down -v

prune: down 
	docker system prune -a  
