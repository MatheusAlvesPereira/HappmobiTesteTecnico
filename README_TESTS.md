# Executando Testes

Este projeto utiliza testes locais para validação do código.

## 📋 Como Executar os Testes

### Backend

Execute os testes do backend:
```bash
cd backend
npm test
```

Para executar em modo watch (re-execução automática):
```bash
npm run test:watch
```

Para gerar relatório de cobertura:
```bash
npm run test:coverage
```

### Frontend

Execute os testes do frontend:
```bash
cd frontend
npm test
```

## 📊 Cobertura de Testes

Os relatórios de cobertura são gerados em:
- Backend: `backend/coverage/`
- Frontend: `frontend/coverage/`

## 🧪 Estrutura de Testes

### Backend
- Framework: Jest
- Ambiente: Node.js com MongoDB Memory Server (banco em memória para testes)
- Localização: `backend/src/__tests__/`

### Frontend
- Framework: Jasmine + Karma
- Ambiente: Browser headless
- Localização: `frontend/src/`

## 💡 Dicas

- Execute os testes antes de fazer commits para garantir qualidade
- Use `test:watch` durante o desenvolvimento para feedback rápido
- Verifique a cobertura de testes regularmente para identificar áreas não testadas

