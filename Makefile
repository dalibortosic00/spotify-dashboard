dev:
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up --build -d

prod:
	docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml up --build -d

down:
	docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml down
	docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml down