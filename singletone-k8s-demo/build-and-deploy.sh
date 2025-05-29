#!/bin/bash

echo "🔨 Construyendo imágenes Docker..."

# Build backend
cd backend
docker build -t singletone-backend:latest .
cd ..

# Build frontend
cd frontend
docker build -t singletone-frontend:latest .
cd ..

echo "🚀 Desplegando en Kubernetes..."

# Aplicar configuraciones
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-config.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

echo "⏳ Esperando que los pods estén listos..."
kubectl wait --for=condition=ready pod -l app=postgres -n singletone --timeout=120s
kubectl wait --for=condition=ready pod -l app=backend -n singletone --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend -n singletone --timeout=120s

echo "✅ Despliegue completado!"
echo "🌐 Accede a la aplicación en: http://localhost"

# Mostrar estado
kubectl get pods -n singletone
kubectl get services -n singletone