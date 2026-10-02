# AGENTS.md

## Stack Tecnológico
- Next.js 16 (App Router), React 19, Tailwind v4 (`@tailwindcss/postcss`)
- ESLint: `eslint-config-next/core-web-vitals` (`eslint.config.mjs`)
- Alias: `@/*` → `src/*` (`jsconfig.json`)
- Fuentes: Poppins + Inter (`next/font/google`)
- Imágenes: `next.config.mjs` permite `res.cloudinary.com` (`remotePatterns`)

## Comandos
- `npm run dev` — Turbopack, puerto `3001`
- `npm run build` — Build de producción
- `npm run start` — Inicia build (Docker puerto `3001`)
- `npm run lint` — ESLint

## API y Entorno
- `src/lib/api.js`: servidor usa `process.env.API_URL_SERVER || 'http://localhost:3000'`; cliente usa `http://localhost:3000`. Backend en `http://localhost:3000` (dev).
- Auth: JWT en `localStorage` (`token`, `email`, `username`). `src/hooks/useAuth.js` decodifica (base64url) y sincroniza vía `storage`. Guards client-side con `useAuth`.

## Arquitectura y Estructura
- App Router en `src/app/`. `layout.js` envuelve con `AppShell` (`src/components/AppShell.js`).
- Sidebar oculta en `/login`, `/registro`, `/acceso-denegado`, `/completar-perfil` (`RUTAS_SIN_SIDEBAR`).
- Entidades: `personajes`, `tripulaciones`, `tripulantes`, `deportes`, `estadisticas`.
- `tripulantes` dependen de una tripulación (sin lista global).
- Componentes: `SelectorImagen` (JPEG/PNG/WebP, máx. 5MB), `InputEtiquetas` (array + evita duplicados), `ModalConfirmarBorrado`, `BotonAgregar`, `Sidebar`.
- Estilos: variables Tailwind en `src/app/globals.css` (`--color-navy`, `--color-gold`, `--color-secondary`, `--color-skill`, `--color-ink`, `--color-surface-alt`).

## Convenciones
- Subidas con `FormData`. Si imagen > 5MB, backend devuelve `413` (usar ese mensaje).
- `habilidades`, `arcos` se envían como `JSON.stringify(...)` en FormData.
- `frutaDiablo` se envía como string JSON `{nombre, tipo, despertada}`.
- `GET /tripulaciones/:id/personajes` devuelve mezcla con `tipo = "personaje"` o `"tripulante"`. Enlace: `/personajes/:id` si `tipo==='personaje'`, else `/tripulantes/:id`.
- Imágenes Cloudinary: preservar `replace('/upload/', '/upload/f_auto,q_auto,w_400/')` al renderizar desde backend.
- Detalles server-side: usar `cache: 'no-store'` cuando se necesita frescura.
- `useSearchParams()` requiere `<Suspense>` (seguir patrón existente).

## Tripulantes
- `tripulantes/nuevo`: usa `useSearchParams()` en `<Suspense>`, lee `?tripulacion=ID`, redirige a `/tripulaciones` si falta. Sin select de tripulación (envía `tripulacion` fijo).
- `tripulantes/[id]`: botón volver → `/tripulaciones/:id` de la tripulación (viene del backend). Incluye sección Arcos.
- `tripulantes/[id]/editar`: tripulación solo lectura (sin select).

## Memoria
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- Si algo se convierte en una regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
- No guardes nunca datos sensibles (claves, tokens, datos personales).

## Límites
- No modificar contratos del backend (ajustarse a los shapes ya usados).
- No tocar `.env`.
- No instalar dependencias sin preguntar.
- No hacer commit ni push.
- Preservar textos en español y estilos existentes al editar formularios.
- Siempre: actualizar `MEMORY.md` al terminar cada tarea.

## Verificación
- Al terminar cada tarea: `npm run lint` y `npm run build` (no hay script de tests).