#!/bin/bash

# Script de inicio para Docker Desktop
# Uso: ./start.sh

echo "🐳 Iniciando proyecto con Docker Compose..."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado o no está en el PATH"
    exit 1
fi

# Verificar si docker-compose está disponible
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose no encontrado, intentando con 'docker compose'..."
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo "📦 Levantando servicios..."
$COMPOSE_CMD up -d --build

echo ""
echo "⏳ Esperando a que los servicios se inicien..."
sleep 10

echo ""
echo "✅ Servicios iniciados!"
echo ""
echo "📱 Accede a la aplicación en:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/health"
echo "   Mantis: http://localhost:3200"
echo "   Redmine: http://localhost:3100"
echo ""
echo "📋 Ver logs:"
echo "   $COMPOSE_CMD logs -f"
echo ""
echo "🛑 Para detener:"
echo "   $COMPOSE_CMD down"
