# 🚀 Guia de Deployment no EasyPanel

## Pré-requisitos

- EasyPanel instalado e rodando
- Baserow já configurado com a tabela de vagas
- Token de API do Baserow

## Opção 1: Deploy via Docker Compose (Recomendado)

### Passo 1: Preparar os arquivos

1. Copie toda a pasta `job-dashboard` para seu servidor
2. Navegue até a pasta:
   ```bash
   cd /path/to/job-dashboard
   ```

### Passo 2: Iniciar via Docker Compose

```bash
docker-compose up -d
```

### Passo 3: Verificar status

```bash
docker-compose ps
```

Você deve ver dois containers rodando:
- `job-dashboard-backend` (porta 8000)
- `job-dashboard-frontend` (porta 3000)

### Passo 4: Acessar a aplicação

- **Frontend**: http://seu-dominio:3000
- **Backend API**: http://seu-dominio:8000/api

---

## Opção 2: Deploy via EasyPanel UI

### Passo 1: Acessar EasyPanel

1. Abra seu painel EasyPanel
2. Vá para **Services** ou **Applications**

### Passo 2: Adicionar Backend

1. Clique em **Add Service** ou **New Application**
2. Selecione **Docker**
3. Configure:
   - **Name**: `job-dashboard-backend`
   - **Image**: `node:18-alpine`
   - **Build Context**: `./backend`
   - **Dockerfile**: `Dockerfile`
   - **Port**: `8000`
   - **Environment Variables**:
     ```
     PORT=8000
     BASEROW_URL=https://n8n-baserow.v6s8rs.easypanel.host/api/database/rows/table
     BASEROW_TOKEN=xUhLDnUtV09UKOSDDd5kgW9E1GBzPA0x
     TABLE_ID=699
     ```
4. Deploy

### Passo 3: Adicionar Frontend

1. Clique em **Add Service** ou **New Application**
2. Selecione **Docker**
3. Configure:
   - **Name**: `job-dashboard-frontend`
   - **Image**: `nginx:alpine`
   - **Build Context**: `./frontend`
   - **Dockerfile**: `Dockerfile`
   - **Port**: `3000`
   - **Environment Variables**:
     ```
     REACT_APP_API_URL=http://job-dashboard-backend:8000/api
     ```
4. Deploy

---

## Opção 3: Deploy via SSH

### Passo 1: Conectar ao servidor

```bash
ssh seu-usuario@seu-servidor
```

### Passo 2: Clonar ou copiar arquivos

```bash
# Se estiver em um repositório Git
git clone seu-repositorio /opt/job-dashboard
cd /opt/job-dashboard

# Ou copiar via SCP
scp -r job-dashboard seu-usuario@seu-servidor:/opt/
cd /opt/job-dashboard
```

### Passo 3: Iniciar com Docker Compose

```bash
docker-compose up -d
```

### Passo 4: Configurar domínio (opcional)

Se quiser usar um domínio customizado, configure um reverse proxy (Nginx/Apache) apontando para:
- Frontend: `localhost:3000`
- Backend: `localhost:8000`

---

## 🔧 Configuração Pós-Deploy

### Acessar Configurações

1. Abra http://seu-dominio:3000
2. Clique em **⚙️ Configurações**
3. Atualize se necessário:
   - URL do Baserow
   - Token de API
   - ID da Tabela

### Testar Conexão

1. Vá para a página principal
2. Você deve ver as vagas carregadas
3. Teste os filtros

---

## 📊 Monitoramento

### Ver logs

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f job-dashboard-backend

# Apenas frontend
docker-compose logs -f job-dashboard-frontend
```

### Verificar status

```bash
docker-compose ps
```

### Reiniciar containers

```bash
docker-compose restart
```

---

## 🔄 Atualizações

### Atualizar código

```bash
# Parar containers
docker-compose down

# Atualizar arquivos (git pull ou copiar novos)
git pull origin main

# Reconstruir e iniciar
docker-compose up -d --build
```

---

## 🛠️ Troubleshooting

### Erro: "Connection refused"

1. Verifique se os containers estão rodando:
   ```bash
   docker-compose ps
   ```

2. Verifique os logs:
   ```bash
   docker-compose logs -f
   ```

3. Reinicie:
   ```bash
   docker-compose restart
   ```

### Erro: "Cannot connect to Baserow"

1. Verifique a URL do Baserow
2. Verifique o token de API
3. Teste manualmente:
   ```bash
   curl -H "Authorization: Token seu_token" https://seu-baserow.com/api/database/rows/table/699/
   ```

### Erro: "Port already in use"

Se as portas 3000 ou 8000 já estão em uso:

1. Encontre o processo:
   ```bash
   lsof -i :3000
   lsof -i :8000
   ```

2. Mate o processo:
   ```bash
   kill -9 PID
   ```

3. Ou altere as portas no `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Novo: 3001
     - "8001:8000"  # Novo: 8001
   ```

---

## 🔐 Segurança em Produção

### 1. Use HTTPS

Configure um certificado SSL/TLS via:
- Let's Encrypt (recomendado)
- Seu provedor de hospedagem
- Nginx/Apache reverse proxy

### 2. Proteja o Backend

Se o backend não precisa ser acessado diretamente:
- Remova a porta 8000 do `docker-compose.yml`
- Configure apenas o frontend para acessar via rede interna

### 3. Variáveis de Ambiente

Nunca commite credenciais. Use:
```bash
# Criar arquivo .env
echo "BASEROW_TOKEN=seu_token_secreto" > .env

# Referenciar no docker-compose.yml
env_file: .env
```

### 4. Firewall

Configure firewall para aceitar apenas:
- Porta 3000 (frontend)
- Porta 80/443 (HTTP/HTTPS)

---

## 📈 Performance

### Cache

O backend implementa cache de 5 minutos. Para limpar:
```bash
docker-compose restart job-dashboard-backend
```

### Escalabilidade

Para suportar mais vagas:
1. Aumente o TTL do cache em `backend/server.js`
2. Considere adicionar um banco de dados (Redis)
3. Implemente paginação no frontend

---

## 📞 Suporte

Para problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Teste a API: `curl http://localhost:8000/api/health`
3. Verifique a conectividade com Baserow

---

**Desenvolvido com ❤️ para Anderson Grazina**
