# 🌽 Overview
Bob’s Corn is a system that helps farmer Bob sell corn to his clients with fair policies. It includes:

* A backend API with rate limiting (1 corn per client per minute)
* A frontend client portal for easy corn purchases

# 🛠️ Technologies
* Backend: NestJS with SQL database for rate limiting
* Frontend: Angular with Tailwind/Shadcn
* Database: SQL (SQLite/PostgreSQL/MySQL)

# 🚀 Getting Started
## Prerequisites
* Node.js (v16 or later)
* npm
* SQL database (SQLite works for development)

## Backend Setup
1. Navigate to the backend folder:

```bash
$ cd backend
```

2. Install dependencies:

```bash
$ npm install
```

3.Create a `.env` file in the project root with the following variables:

```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

Example: 

```

DB_PASSWORD=bobscorn_pass
DB_NAME=BobsCornDB
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres

```
4. Build the docker instance
```bash
$ docker-compose up -d
```

5. Start the server

```bash
$ npm run start:dev
```

The API will be available at http://localhost:3000

## Frontend Setup
1. Navigate to the frontend folder:

```bash
$ cd frontend
```

2. Install dependencies:

```bash
$ npm install
```

4. Start the development server:

```bash
$ ng serve
```

The client portal will be available at http://localhost:4200