# typescript-node-boilerplate

> ⚡️ minimal boilerplate based on typescript with node, docker, pm2 ⚡️

- [If you want a javascript based boilerplate, click here!](https://github.com/amamov/typescript-node-boilerplate/tree/javascript)

## Technology

- Typescript
- ESLint
- Prettier
- Node.js
- Docker
- PM2
- Dotenv

## Requirements

- `Node.js (>= 10.13.0, except for v13)`

## Getting Started

1. `git clone https://github.com/amamov/typescript-node-boilerplate.git <project_name>`

2. `cd <project_name>`

3. `npm i`

4. `rm -rf .git`

5. `touch .env` (create dotenv file)

6. `npm run start:dev` or `yarn start:dev`

## .env example

```python
# .env

PORT="8000"
MONGO_URL="mongodb+srv://..."
COOKIE_SECRET="..."
JWT_SECRET="..."
JWT_EXPIRATION="1y"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD="1205"
```
