# ⚡ Quick Start - Job Dashboard

## 🚀 Iniciar em 3 Passos

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/job-dashboard.git
cd job-dashboard
```

### 2️⃣ Inicie com Docker Compose
```bash
docker-compose up -d
```

### 3️⃣ Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api

---

## ⚙️ Configurar Baserow

1. Abra http://localhost:3000
2. Clique em **⚙️ Configurações**
3. Preencha:
   - **URL do Baserow**: `https://seu-baserow.com/api/database/rows/table`
   - **Token de API**: Seu token do Baserow
   - **ID da Tabela**: `699`
4. Clique em **Salvar**

---

## 🎯 Usar Filtros

1. **Título da Vaga**: Digite o título (ex: "Desenvolvedor")
2. **Empresa**: Digite o nome (ex: "Google")
3. **Região**: Digite a região (ex: "Brasil")
4. **Localização**: Digite a cidade (ex: "São Paulo")
5. **Data De/Até**: Clique para abrir calendário
6. **Ordenação**: Escolha por Data ou Salário
7. Clique em **Ver** para abrir a vaga

---

## 🛑 Parar a Aplicação

```bash
docker-compose down
```

---

## 📊 Ver Logs

```bash
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f job-dashboard-backend

# Apenas frontend
docker-compose logs -f job-dashboard-frontend
```

---

## 🔄 Reiniciar

```bash
docker-compose restart
```

---

## 🆘 Troubleshooting

### Erro: "Connection refused"
```bash
# Verifique se está rodando
docker-compose ps

# Reinicie
docker-compose restart
```

### Erro: "Cannot connect to Baserow"
1. Verifique a URL do Baserow
2. Verifique o token de API
3. Teste manualmente: `curl -H "Authorization: Token SEU_TOKEN" https://seu-baserow.com/api/database/rows/table/699/`

### Erro: "Port already in use"
```bash
# Encontre o processo
lsof -i :3000
lsof -i :8000

# Mate o processo
kill -9 PID
```

---

## 📚 Documentação Completa

- **README.md** - Documentação principal
- **PROJECT_SUMMARY.md** - Resumo do projeto
- **EASYPANEL_DEPLOYMENT.md** - Guia de deployment
- **GITHUB_SETUP.md** - Instruções GitHub

---

## 🚀 Deploy no EasyPanel

1. Faça push para GitHub (veja GITHUB_SETUP.md)
2. Acesse EasyPanel
3. **Services** → **Add Service** → **Git Repository**
4. Cole a URL do repositório
5. Deploy!

---

**Pronto! Você está rodando o Job Dashboard! 🎉**
