# TODO app in Express.js

Just a simple TODO app to learn new things on both backend and frontend:

- Express.js
- Postgres 
- TypeORM
- JWT
- React
- Redux
- Typescript

Still WIP...

## Setup backend

**1. Install postgres**
 - https://www.postgresql.org/download/

**2. Prepare database for local development**

- create postgres user for the app with username `express_todo_dev` and password `express_todo_dev`:
```bash
psql -U postgres -c "CREATE USER express_todo_dev WITH PASSWORD 'express_todo_dev';"
```

- create `express_todo_dev` database with owner `express_todo_dev`:
```bash
psql -U postgres -c "CREATE DATABASE express_todo_dev OWNER express_todo_dev;"
```

**3. Install project dependencies**

```bash
yarn install
```

**4. Run migrations and seed database**

```bash
yarn db:migrate && yarn db:seed
```

**5. Run server**

```bash
yarn dev
```

## Setup frontend

**0. Open new terminal window and go into `frontend` folder**

```bash
cd frontend
```

**1. Install dependencies**

```bash
yarn install
```

**2. Run frontend app**

```bash
yarn dev
```

You can now open application on http://localhost:5173
Primary user for testing purposes is user with username `test` and password `12345678`
