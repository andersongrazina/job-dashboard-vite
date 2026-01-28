# 🚀 Guia de Deployment - Job Dashboard

## Backend (EasyPanel)

### Configuração no EasyPanel

1. **Criar Nova Aplicação**
   - Nome: `job-dashboard-backend` (ou similar)
   - Tipo: Docker
   - Repositório: `https://github.com/andersongrazina/job-dashboard.git`
   - Branch: `main`

2. **Dockerfile**
   - Caminho: `Dockerfile` (na raiz)
   - Contexto: Raiz do repositório (automático)

3. **Variáveis de Ambiente**
   ```
   PORT=8000
   BASEROW_URL=https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table
   BASEROW_TOKEN=xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x
   TABLE_ID=699
   ```

4. **Porta**
   - Expor: `8000`
   - Protocolo: HTTP

5. **Health Check**
   - Endpoint: `GET /api/health`
   - Intervalo: 30s
   - Timeout: 3s

### Estrutura do Projeto

```
job-dashboard/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── .env
│   ├── Dockerfile ✅
│   └── .dockerignore ✅
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── src/
│   ├── public/
│   ├── nginx.conf
│   ├── Dockerfile ✅
│   └── .dockerignore ✅
└── README.md
```

### Troubleshooting

#### Erro: "package.json not found"
- ✅ Usar `Dockerfile.backend` (não `backend/Dockerfile`)
- ✅ Contexto de build deve ser a raiz do repositório
- ✅ Variáveis de ambiente devem estar configuradas

#### Erro: "Cannot connect to Baserow"
- ✅ Verificar `BASEROW_URL` e `BASEROW_TOKEN`
- ✅ Verificar se a URL é acessível
- ✅ Verificar se o token é válido

#### Erro: "Port already in use"
- ✅ Mudar `PORT` para outra porta (ex: 8001)
- ✅ Verificar se outra aplicação está usando a porta

### Endpoints Disponíveis

```
GET  /api/health              - Health check
GET  /api/settings            - Obter configurações
POST /api/settings            - Atualizar configurações
GET  /api/jobs                - Listar todas as vagas
GET  /api/jobs/search         - Buscar vagas com filtros
```

### Exemplo de Requisição

```bash
curl -X GET http://localhost:8000/api/jobs \
  -H "Content-Type: application/json"
```

### Logs

Para ver os logs em tempo real:
```bash
docker logs -f <container-id>
```

---

## Frontend (EasyPanel)

### Configuração no EasyPanel

1. **Criar Nova Aplicação**
   - Nome: `job-dashboard-frontend`
   - Tipo: Docker
   - Repositório: `https://github.com/andersongrazina/job-dashboard.git`
   - Branch: `main`

2. **Dockerfile**
   - Caminho: `Dockerfile.frontend` (na raiz)
   - Contexto: Raiz do repositório (automático)

3. **Variáveis de Ambiente**
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Porta**
   - Expor: `3000`
   - Protocolo: HTTP

---

## Troubleshooting Geral

### Backend não conecta ao Baserow
1. Verificar se `BASEROW_URL` está correto
2. Verificar se `BASEROW_TOKEN` é válido
3. Verificar se `TABLE_ID` existe no Baserow
4. Testar a URL manualmente no navegador

### Frontend não conecta ao Backend
1. Verificar se `VITE_API_URL` está correto
2. Verificar se o backend está rodando
3. Verificar CORS no backend
4. Abrir DevTools (F12) e verificar erros de rede

### Rebuild necessário
Se fizer mudanças no código:
1. Fazer commit e push
2. No EasyPanel, clicar em "Redeploy" ou "Rebuild"
3. Aguardar o build completar

---

## Notas Importantes

- ✅ Cada aplicação (backend e frontend) tem seu próprio Dockerfile
- ✅ Cada pasta tem seu próprio `.dockerignore`
- ✅ Sempre fazer commit antes de fazer deploy
- ✅ Verificar logs após deploy para erros
- ✅ O contexto de build deve ser a pasta da aplicação (backend/ ou frontend/)

---

**Última atualização:** 27 de Janeiro de 2026
