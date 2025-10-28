# 🚀 Guia de Uso - Happmobi Teste Técnico

## 📋 Visão Geral do Projeto

Este é um sistema de **gerenciamento de veículos e reservas** com:

- **Backend**: API REST em Node.js + TypeScript + Express
- **Frontend**: Interface Angular 18
- **Banco de Dados**: MongoDB 7
- **Documentação**: Swagger UI

## 🔌 Portas e Acessos

| Serviço | Porta | URL | Descrição |
|---------|-------|-----|-----------|
| **Backend API** | 5000 | http://localhost:5000/api | API REST |
| **Swagger Docs** | 5000 | http://localhost:5000/api/docs | Documentação interativa |
| **Frontend** | 4200 | http://localhost:4200 | Interface Angular |
| **MongoDB** | 27017 | localhost:27017 | Banco de dados |

## 🐳 Executando com Docker

### Comandos

```bash
# Iniciar todos os serviços (backend, mongodb)
docker compose up --build

# Ver logs dos containers
docker compose logs -f

# Ver status dos containers
docker compose ps

# Parar os containers
docker compose down
```

### O que está rodando?

✅ **Atualmente**: 
- Backend rodando na porta 5000 ✅
- MongoDB rodando na porta 27017 ✅
- Frontend precisa rodar separadamente (veja abaixo)

## 🎯 Como Usar

### 1️⃣ Acessar Swagger (Backend API)

Acesse: **http://localhost:5000/api/docs**

Swagger fornece interface para testar endpoints:
- `/api/auth/login` - Login
- `/api/auth/register` - Registro
- `/api/vehicles` - CRUD de veículos
- `/api/reservations` - CRUD de reservas

### 2️⃣ Executar Frontend

**Opção A - Com Docker**:
```bash
cd C:\Users\mathe\Desktop\HappmobiTesteTecnico
docker compose up frontend --build
```

**Opção B - Localmente (sem Docker)**:
```bash
cd frontend
npm install
npm run start
```

Acesse: **http://localhost:4200**

### 3️⃣ Fluxo de Uso

1. **Acessar Frontend** → http://localhost:4200
2. **Criar conta** → `/register`
3. **Login** → `/login` 
4. **Ver veículos** → `/vehicles` (requer autenticação)
5. **Fazer reserva** → Clicar em um veículo
6. **Ver minhas reservas** → `/reservations`

## 🔐 Endpoints Principais

### Autenticação
```
POST /api/auth/register
POST /api/auth/login
```

### Veículos (requer JWT)
```
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

### Reservas (requer JWT)
```
POST   /api/reservations
DELETE /api/reservations/:id
GET    /api/reservations/user/:userId
```

## 🐛 Resolução de Problemas

### Backend não conecta ao MongoDB
✅ **RESOLVIDO**: Ajustei `MONGO_URI` para usar MongoDB local (`mongodb://mongo:27017/happmobi`)

### Frontend não acessa API
Verifique se o backend está rodando:
```bash
docker compose ps
```

### Erro "Connection refused"
Verifique:
1. Docker Desktop está rodando
2. Containers estão UP: `docker compose ps`
3. Portas não estão ocupadas

## 📁 Estrutura do Projeto

```
HappmobiTesteTecnico/
├── backend/          # API Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── Dockerfile
├── frontend/         # Angular 18
│   ├── src/app/
│   │   ├── pages/
│   │   ├── services/
│   │   └── guards/
│   └── Dockerfile
└── docker-compose.yml
```

## 🎉 Próximos Passos

1. ✅ Backend está funcionando (porta 5000)
2. ✅ MongoDB está funcionando (porta 27017)
3. ⏳ Frontend precisa ser iniciado (porta 4200)
4. ⏳ Testar fluxo completo: Registro → Login → Veículos → Reservas

---

**Status Atual**: Backend OK ✅ | MongoDB OK ✅ | Frontend pendente ⏳

