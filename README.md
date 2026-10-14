# FitPulse API

API REST de FitPulse en Node.js, Express 5 y MySQL.

## Puesta en marcha

1. Crear la base de datos ejecutando `database/fitpulse.sql` en MySQL. Si existe una versión anterior del esquema, eliminarla antes con `DROP SCHEMA fitpulse;`.
2. Copiar `.env.example` como `.env` y completar las credenciales de MySQL.
3. Instalar dependencias: `npm install`
4. Iniciar el servidor: `npm start`

El servidor queda en `http://localhost:3000` y la documentación interactiva (Swagger UI) en `http://localhost:3000/api-docs`.

## Pruebas

Importar `tests/fitpulse.postman_collection.json` en Postman y ejecutarla con el Collection Runner, en orden. Cada carpeta contiene casos de éxito y de error por recurso. Thunder Client también puede importarla, pero no ejecuta los scripts de verificación.

## Estructura

- `routes`: URIs, métodos HTTP y validación asociada
- `middlewares`: validación de entradas y manejo de errores
- `controllers`: traducción entre HTTP y servicios
- `services`: reglas de negocio
- `dao`: consultas SQL parametrizadas
- `config`: conexión a MySQL y constantes
- `docs`: especificación OpenAPI
- `database`: script SQL del esquema
