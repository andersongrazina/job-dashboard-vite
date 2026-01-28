# 📤 Instruções para Push no GitHub

## Passo 1: Criar repositório no GitHub

1. Acesse https://github.com/new
2. Preencha os dados:
   - **Repository name**: `job-dashboard`
   - **Description**: `Dashboard de vagas com filtros dinâmicos conectado ao Baserow`
   - **Visibility**: Public (ou Private, conforme preferir)
   - **Initialize this repository with**: Deixe em branco (já temos commits locais)
3. Clique em **Create repository**

## Passo 2: Adicionar remote e fazer push

```bash
# Navegue até a pasta do projeto
cd /workspace/job-dashboard

# Adicione o remote (substitua SEU_USUARIO e SEU_REPO)
git remote add origin https://github.com/SEU_USUARIO/job-dashboard.git

# Renomeie a branch para main (opcional, mas recomendado)
git branch -M main

# Faça o push
git push -u origin main
```

## Passo 3: Verificar no GitHub

1. Acesse https://github.com/SEU_USUARIO/job-dashboard
2. Você deve ver todos os arquivos do projeto

## 🔑 Autenticação (se necessário)

Se pedir autenticação, você pode usar:

### Opção A: Personal Access Token (Recomendado)

1. Vá para https://github.com/settings/tokens
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Selecione escopos: `repo` (full control of private repositories)
4. Copie o token
5. Quando pedir senha, use o token como senha

### Opção B: SSH Key

1. Gere uma chave SSH:
   ```bash
   ssh-keygen -t ed25519 -C "seu-email@example.com"
   ```

2. Adicione a chave pública ao GitHub:
   - Vá para https://github.com/settings/keys
   - Clique em **New SSH key**
   - Cole o conteúdo de `~/.ssh/id_ed25519.pub`

3. Use a URL SSH:
   ```bash
   git remote add origin git@github.com:SEU_USUARIO/job-dashboard.git
   ```

## 📋 Comandos Rápidos

```bash
# Ver remote configurado
git remote -v

# Fazer push de atualizações futuras
git push origin main

# Fazer pull de atualizações
git pull origin main

# Ver status
git status
```

## 🚀 Deploy via GitHub no EasyPanel

Depois que o repositório estiver no GitHub, você pode:

1. Acessar EasyPanel
2. Ir para **Services** → **Add Service**
3. Selecionar **Git Repository**
4. Colar a URL do repositório: `https://github.com/SEU_USUARIO/job-dashboard.git`
5. Selecionar branch: `main`
6. EasyPanel fará o clone e deploy automaticamente

## 📝 Próximas Atualizações

Para fazer commits futuros:

```bash
# Fazer alterações nos arquivos
# ...

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Descrição das mudanças"

# Fazer push
git push origin main
```

---

**Pronto! Seu projeto está versionado e pronto para deploy! 🎉**
