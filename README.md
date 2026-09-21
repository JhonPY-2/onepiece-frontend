# onepiece-frontend

Frontend (Next.js 16, React 19, Tailwind 4) de One Piece App. CRUD de personajes y atletas, autenticación JWT, subida de fotos a Cloudinary y estadísticas.

## Correrlo

```
npm install
npm run dev
```

Abre http://localhost:3001. Espera el backend en `http://localhost:3000`.

**Variable de entorno opcional `API_URL_SERVER`**: URL del backend para las peticiones hechas desde el servidor de Next.js; por defecto `http://localhost:3000`; con Docker Compose vale `http://backend:3000`. Las peticiones que hace el navegador usan siempre `http://localhost:3000`.

> Consulta el README principal del proyecto en [README principal (repositorio mongo-crud)](https://github.com/JhonPY-2/mongo-crud).