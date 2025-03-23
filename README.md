# TODO app in Express.js

Just a simple app to learn new things on the backend - working with tools like:
- Express.js framework itself
- Postgres and TypeORM
- PassportJS
- many more ... ?

## Setup

### 1. Install postgres
 - https://www.postgresql.org/download/
### 2. Prepare database for local development
- create `express_todo_dev` database:
```bash
sudo -u postgres createdb express_todo_dev
```

- create postgres user for the app with username `express_todo_dev` and password `express_todo_dev`:
```bash
psql -U postgres -c "CREATE USER express_todo_dev WITH PASSWORD 'express_todo_dev';"
```
