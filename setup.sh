#!/bin/bash

# Job Dashboard - Setup Script
# Este script facilita o setup da aplicação

echo "🚀 Job Dashboard - Setup"
echo "========================"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker não está instalado. Por favor, instale Docker primeiro.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker Compose não está instalado. Por favor, instale Docker Compose primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker e Docker Compose encontrados${NC}"
echo ""

# Menu
echo "Escolha uma opção:"
echo "1) Iniciar aplicação (docker-compose up -d)"
echo "2) Parar aplicação (docker-compose down)"
echo "3) Ver logs (docker-compose logs -f)"
echo "4) Reconstruir containers (docker-compose up -d --build)"
echo "5) Limpar tudo (docker-compose down -v)"
echo ""

read -p "Digite o número da opção (1-5): " option

case $option in
    1)
        echo -e "${BLUE}Iniciando aplicação...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Aplicação iniciada!${NC}"
        echo ""
        echo "Acesse:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend: http://localhost:8000/api"
        ;;
    2)
        echo -e "${BLUE}Parando aplicação...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Aplicação parada!${NC}"
        ;;
    3)
        echo -e "${BLUE}Mostrando logs...${NC}"
        docker-compose logs -f
        ;;
    4)
        echo -e "${BLUE}Reconstruindo containers...${NC}"
        docker-compose up -d --build
        echo -e "${GREEN}✅ Containers reconstruídos!${NC}"
        ;;
    5)
        echo -e "${YELLOW}⚠️  Isso vai deletar todos os containers e volumes!${NC}"
        read -p "Tem certeza? (s/n): " confirm
        if [ "$confirm" = "s" ]; then
            docker-compose down -v
            echo -e "${GREEN}✅ Tudo limpo!${NC}"
        else
            echo "Cancelado."
        fi
        ;;
    *)
        echo -e "${YELLOW}Opção inválida!${NC}"
        exit 1
        ;;
esac
