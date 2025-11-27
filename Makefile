.PHONY: up down build dev logs clean init-services

# Start all services in production mode
up:
	docker compose up -d

# Start all services in development mode with hot reload
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Stop all services
down:
	docker compose down

# Build all images
build:
	docker compose build

# View logs
logs:
	docker compose logs -f

# View logs for specific service
logs-%:
	docker compose logs -f $*

# Clean up volumes and images
clean:
	docker compose down -v --rmi local

# Initialize Laravel services (run once, via Docker Composer image)
init-services:
	@echo "Initializing Auth service..."
	docker run --rm -v "$$PWD/services/auth":/app -w /app composer \
		create-project laravel/laravel temp --prefer-dist && \
		mv services/auth/temp/* services/auth/temp/.* services/auth 2>/dev/null || true && \
		rm -rf services/auth/temp
	@echo "Initializing Quests service..."
	docker run --rm -v "$$PWD/services/quests":/app -w /app composer \
		create-project laravel/laravel temp --prefer-dist && \
		mv services/quests/temp/* services/quests/temp/.* services/quests 2>/dev/null || true && \
		rm -rf services/quests/temp
	@echo "Initializing Skills service..."
	docker run --rm -v "$$PWD/services/skills":/app -w /app composer \
		create-project laravel/laravel temp --prefer-dist && \
		mv services/skills/temp/* services/skills/temp/.* services/skills 2>/dev/null || true && \
		rm -rf services/skills/temp
	@echo "Initializing Users service..."
	docker run --rm -v "$$PWD/services/users":/app -w /app composer \
		create-project laravel/laravel temp --prefer-dist && \
		mv services/users/temp/* services/users/temp/.* services/users 2>/dev/null || true && \
		rm -rf services/users/temp
	@echo "Initializing AI service..."
	docker run --rm -v "$$PWD/services/ai":/app -w /app composer \
		create-project laravel/laravel temp --prefer-dist && \
		mv services/ai/temp/* services/ai/temp/.* services/ai 2>/dev/null || true && \
		rm -rf services/ai/temp
	@echo "All services initialized!"

# Clear Laravel caches (no migrations needed - using Firestore)
cache-clear:
	docker compose exec auth php artisan cache:clear
	docker compose exec quests php artisan cache:clear
	docker compose exec skills php artisan cache:clear
	docker compose exec users php artisan cache:clear
	docker compose exec ai php artisan cache:clear

# Frontend only (local development without Docker)
frontend:
	cd frontend && npm run dev

# Install frontend dependencies
frontend-install:
	cd frontend && npm install
