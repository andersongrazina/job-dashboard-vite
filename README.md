# 📊 Job Dashboard

Dashboard interativo para visualizar e filtrar vagas de emprego do Baserow com interface moderna e responsiva.

## 🚀 Funcionalidades

- ✅ Integração com Baserow API
- ✅ Filtros dinâmicos (empresa, região, localização, cargo)
- ✅ Filtro de data com calendário
- ✅ Ordenação por data e salário
- ✅ Tabela responsiva
- ✅ Cache de dados (5 minutos)
- ✅ Configurações editáveis
- ✅ Interface moderna com Vite + React

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Conta no Baserow com API Token

## 🔧 Configuração

### 1. Clonar o repositório

```bash
git clone <seu-repositorio>
cd job-dashboard
```

### 2. Criar arquivo `.env`

```bash
cp .env.example .env
```

Editar `.env` com suas credenciais:

```env
BASEROW_URL=https://seu-baserow-url/api/database/rows/table
BASEROW_TOKEN=seu_token_aqui
TABLE_ID=699
```

### 3. Executar com Docker Compose

```bash
docker-compose up -d
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## 🛠️ Desenvolvimento Local

### Backend

```bash
cd backend
npm install
npm start
```

Backend rodará em `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend rodará em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
job-dashboard/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── Dashboard.jsx  # Componente principal
│   │   ├── Dashboard.css  # Estilos
│   │   ├── main.jsx       # Entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## 🔌 API Endpoints

### GET `/api/health`
Health check do servidor

### GET `/api/jobs`
Retorna todas as vagas com cache

**Response:**
```json
{
  "data": [...],
  "cached": true,
  "total": 100,
  "timestamp": "2026-01-28T00:42:49Z"
}
```

### GET `/api/jobs/search`
Busca vagas com filtros

**Query Parameters:**
- `company` - Filtrar por empresa
- `source_region` - Filtrar por região
- `location` - Filtrar por localização
- `job_title` - Filtrar por cargo
- `dateFrom` - Data inicial (YYYY-MM-DD)
- `dateTo` - Data final (YYYY-MM-DD)
- `sortBy` - Campo para ordenação (collected_at, salary_raw, company, job_title)
- `sortOrder` - Ordem (asc, desc)

### GET `/api/settings`
Retorna configurações atuais

### POST `/api/settings`
Atualiza configurações

**Body:**
```json
{
  "baserowUrl": "https://...",
  "baserowToken": "token",
  "tableId": "699"
}
```

## 🎨 Customização

### Cores
Editar `frontend/src/Dashboard.css` para alterar cores:
- Verde primário: `#4CAF50`
- Vermelho secundário: `#f44336`

### Campos da Tabela
Editar `frontend/src/Dashboard.jsx` para adicionar/remover colunas

## 📦 Build para Produção

```bash
docker-compose build
docker-compose up -d
```

## 🐛 Troubleshooting

### Erro de conexão com Baserow
- Verificar se o token está correto
- Verificar se a URL do Baserow está acessível
- Verificar se o ID da tabela existe

### Frontend não conecta ao backend
- Verificar se `VITE_API_URL` está correto
- Verificar se o backend está rodando
- Verificar CORS no backend

### Cache não está funcionando
- Cache é armazenado em memória (5 minutos)
- Limpar cache ao atualizar configurações

## 📝 Licença

MIT

## 👤 Autor

Dr. Santos - Departamento Administrativo

---

**Última atualização:** 28 de janeiro de 2026
