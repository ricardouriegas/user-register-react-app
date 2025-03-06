
# Aplicación de Registro de Usuarios

Esta aplicación incluye un sistema de registro de usuarios con validación en el frontend y backend, y almacenamiento seguro de contraseñas.

## Requisitos Previos

- Node.js (v14 o superior)
- XAMPP o MariaDB/MySQL instalado
- NPM o Yarn

## Configuración

1. Iniciar el servidor MySQL/MariaDB (a través de XAMPP o directamente)
2. Crear la base de datos y tabla:
   - Puedes ejecutar el script SQL en `src/database/BD.sql` en phpMyAdmin o mediante el cliente MySQL
   - Esto creará una base de datos llamada `practica04` con la tabla necesaria

3. Instalar dependencias del backend:
   ```
   cd src/server
   npm install express cors body-parser bcryptjs mysql2
   ```

4. Iniciar el servidor backend:
   ```
   node src/server/index.js
   ```

5. En otra terminal, iniciar la aplicación frontend:
   ```
   npm run dev
   ```

## Uso

1. Accede a la aplicación en `http://localhost:5173`
2. Completa el formulario de registro con:
   - Nombre (obligatorio)
   - Apellidos (opcional)
   - Nombre de usuario (obligatorio)
   - Contraseña (obligatorio)
   - Confirmar contraseña (obligatorio)
3. Al enviar el formulario, recibirás una notificación de éxito o error según corresponda

## Características

- Validación en tiempo real del nombre de usuario
- Verificación de coincidencia de contraseñas
- Almacenamiento seguro de contraseñas con BCrypt (factor de trabajo 12)
- Verificación de unicidad de nombre de usuario
- Manejo de errores con notificaciones visuales
