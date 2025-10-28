HappmobiTesteTecnico

Stack
- API: Node.js + TypeScript + Express + MongoDB (Mongoose) + JWT
- Frontend: Angular 18
- Docs: Swagger (\`/api/docs\`)
- Docker: MongoDB + Backend service

Prerequisites
- Node 20+
- npm 10+
- Docker (optional) and Docker Compose

Project Structure
- \`backend\`: API com Express/TypeScript
- \`frontend\`: Angular 18

Running with Docker
1. No terminal, na raiz do projeto:
   - \`docker compose up --build\`
2. Serviços expostos:
   - API: \`http://localhost:5000/api\`
   - Swagger: \`http://localhost:5000/api/docs\`
   - MongoDB: \`localhost:27017\`

Running locally (sem Docker)
Backend
1. \`cd backend\`
2. \`cp .env.example .env\` ou crie \`.env\` com:
   - \`MONGO_URI=mongodb://localhost:27017/happmobi\`
   - \`JWT_SECRET=supersecret\`
   - \`PORT=5000\`
3. \`npm install\`
4. Executar dev: \`npm run dev\` ou build: \`npm run build && npm start\`

Frontend
1. \`cd frontend\`
2. \`npm install\`
3. \`npm run start\` → \`http://localhost:4200\`

API Endpoints (resumo)
- Auth
  - POST \`/api/auth/register\`
  - POST \`/api/auth/login\`
- Users
  - GET \`/api/users\` (JWT)
  - GET \`/api/users/:id\` (JWT)
  - PUT \`/api/users/:id\` (JWT)
  - DELETE \`/api/users/:id\` (JWT)
  - GET \`/api/users/:id/vehicles\` (JWT)
- Vehicles
  - GET \`/api/vehicles\` (JWT)
  - POST \`/api/vehicles\` (JWT)
  - PUT \`/api/vehicles/:id\` (JWT)
  - DELETE \`/api/vehicles/:id\` (JWT)
- Reservations
  - POST \`/api/reservations\` (JWT)
  - DELETE \`/api/reservations/:id\` (JWT)
  - GET \`/api/reservations/user/:userId\` (JWT)

Swagger
- Após subir o backend: \`http://localhost:5000/api/docs\`

Assets do Figma
- Baixe os arquivos do link enviado e coloque-os em \`frontend/src/assets\`.
- Atualize imagens e ícones nos componentes conforme necessário.

Scripts úteis
- Backend: \`npm run dev\`, \`npm run build\`, \`npm start\`
- Frontend: \`npm run start\`, \`npm run build\`


