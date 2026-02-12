# Coffee-BE

Backend microservices for the Coffee Shop project. This repository contains separate services (Node.js and Go) and a Docker Compose setup to run them together.

**Prerequisites**
- Node.js (v14+ recommended) and npm/yarn
- Docker and Docker Compose (for running the full stack)
- MongoDB (if running services locally without Docker)
- Go (only required to run `oauth-service` locally)

**Quick start — run everything with Docker Compose**

1. From the repository root run:

```bash
cd Coffee-BE
docker-compose up --build
```

This builds and starts all services defined in `docker-compose.yml`.

To stop and remove containers:

```bash
docker-compose down
```

**Run a single service locally (Node.js services)**

Each Node service (for example `admin-service`, `cart-service`, `order-service`, `payment-service`, `user-service`) can be run independently for development.

POSIX (macOS/Linux):
```bash
cd admin-service
npm install
npm start    # or `node server.js` if no start script
```

PowerShell (Windows):
```powershell
Set-Location -Path .\admin-service
npm install
npm start
```

**Run the Go service (`oauth-service`) locally**

```bash
cd oauth-service
go mod download
go run main.go
```

**Environment files**
- Many services include `.env.development` templates. Copy or create a `.env` file for each service before running locally.

Example (POSIX):
```bash
cp admin-service/.env.development admin-service/.env
```

Example (PowerShell):
```powershell
Copy-Item admin-service/.env.development admin-service/.env
```

Ensure you set at minimum: MongoDB connection string (e.g. `MONGODB_URI`), service `PORT`, and any API keys/secrets used by that service.

**Database: restoring sample data**

This repo contains a `mongobackup/` folder with BSON exports. To restore the sample data to your local MongoDB:

```bash
mongorestore --uri="mongodb://localhost:27017" --drop mongobackup/
```

Adjust the `--uri` value if your MongoDB is hosted elsewhere.

**Inspect ports and service configuration**
Ports, environment variable names, and service mappings are defined in `docker-compose.yml` and each service's config files. See [docker-compose.yml](Coffee-BE/docker-compose.yml#L1) for the compose setup.

**Logs and troubleshooting**
- View combined logs: `docker-compose logs -f`
- View logs for one service: `docker-compose logs -f <service-name>`
- For local runs, check the console where you started the service. If a service fails to connect to MongoDB, ensure your `MONGODB_URI` is correct and MongoDB is running.

**Useful commands**
- Build images only: `docker-compose build`
- Run containers in background: `docker-compose up -d`
- Stop and remove containers: `docker-compose down`

**Notes & next steps**
- See each service folder for service-specific README details (e.g. `admin-service/README.md`).
- If you plan to develop locally, copy the `.env.development` files and customize them per service.

Contributions and issues: open an issue in this repo or submit a PR with improvements to these instructions.

