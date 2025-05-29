# arqui251_individual_01
Se estará subiendo la actividad.

**Comandos importantes**:

```
# Bajarlo todo
kubectl delete namespace singletone

# Crearlo todo
./build-and-deploy.sh

# Observar pods corriendo
kubectl get pods -n singletone

# Obtener todos los datos
kubectl get all -n singletone
```

**Verificar el frontend**
```
# Entrar al frontend
http://localhost:3000/
```

**Verificar el backend**
```
# Hacer una consulta a la api get de lista de usuarios
http://localhost:3001/api/users
```