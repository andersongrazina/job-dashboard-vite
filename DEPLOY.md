# Guia de Deploy - Job Dashboard

## Estrutura do Projeto

```
job-dashboard/
├── frontend/          # React App (porta 3000)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── backend/           # Node.js API (porta 8000)
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env
└── docker-compose.yml # Para desenvolvimento local
```

## Deploy no EasyPanel

### 1. Frontend (React)

**Configuração no EasyPanel:**
- **Nome do Serviço:** `frontend`
- **Dockerfile:** `frontend/Dockerfile`
- **Contexto de Build:** `./frontend`
- **Porta:** `3000`
- **Variáveis de Ambiente:** (nenhuma necessária)

**O que o Dockerfile faz:**
1. Build da aplicação React com Node.js
2. Serve os arquivos estáticos com Nginx
3. Configura proxy para `/api` → backend:8000
4. Fallback para `index.html` (SPA)

### 2. Backend (Node.js)

**Configuração no EasyPanel:**
- **Nome do Serviço:** `backend`
- **Dockerfile:** `backend/Dockerfile`
- **Contexto de Build:** `./backend`
- **Porta:** `8000`
- **Variáveis de Ambiente:**
  ```
  PORT=8000
  BASEROW_URL=https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table
  BASEROW_TOKEN=xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x
  TABLE_ID=699
  ```

**O que o Dockerfile faz:**
1. Instala dependências de produção
2. Copia código da aplicação
3. Expõe porta 8000
4. Inclui health check
5. Inicia com `npm start`

### 3. Conectar Frontend ao Backend

No arquivo `frontend/src/api.js` (ou similar), configure:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

No EasyPanel, adicione a variável de ambiente no frontend:
```
REACT_APP_API_URL=http://backend:8000
```

## Desenvolvimento Local

### Com Docker Compose

```bash
docker-compose up
```

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Sem Docker

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

### Erro: "package.json not found"
- Certifique-se de que o contexto de build está correto
- Verifique se o arquivo `package.json` existe no diretório

### Frontend não consegue conectar ao backend
- Verifique se o backend está rodando
- Confirme a URL da API no frontend
- Verifique CORS no backend

### Porta já em uso
- Mude a porta no Dockerfile ou nas variáveis de ambiente

## Estrutura de Pastas Esperada

```
job-dashboard/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   ├── src/
│   └── build/ (gerado após npm run build)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env
└── docker-compose.yml
```

## Notas Importantes

- ✅ Ambos os Dockerfiles estão otimizados para EasyPanel
- ✅ Sem `.dockerignore` para evitar problemas de build
- ✅ Health check incluído no backend
- ✅ Nginx configurado para SPA no frontend
- ✅ Proxy configurado para `/api` no frontend
