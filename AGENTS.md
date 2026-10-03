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

## Buscadores
- La lista de personajes es el homepage `/` (`src/app/page.js`), no una ruta `/personajes`. `src/app/ListaPersonajes.js` es el Client Component que renderiza el encabezado (título, buscador y botón agregar, en la misma fila `flex justify-between`) y el grid. `page.js` solo hace el fetch y el `<main>`.
- Patrón: fetch en el Server Component (`cache: 'no-store'`) + filtro client-side con `useState` + `useMemo`. El backend no expone búsqueda, no filtrar por query param.
- Normalizar siempre antes de comparar: `toLowerCase()` + `NFD` quitando diacríticos (`/[\u0300-\u036f]/g`). Query vacía o con solo espacios → lista completa.
- Comparar solo `nombre` (con `?? ''` para que un registro sin nombre no matchee cualquier texto).
- Estado vacío obligatorio en español ("No se encontraron personajes" + botón "Limpiar búsqueda"); el `<ul>` vacío a secas no vale.
- Antes de pasar datos a un Client Component, aplanar los documentos de Mongoose a objetos planos: `_id` es un `ObjectId` y `tripulacion` viene poblada. Helper `aObjetoPlano` en `src/app/page.js`.
- Helpers de imagen/color de personajes en `src/lib/personajes.js` (`imagenDe`, `resplandorPorNombre`, `imagenPorNombre`).
- Pendiente: `deportes/page.js` tiene un `input type="search"` decorativo sin filtrar.

## Responsive
- Breakpoint principal: `md` (768 px). Por debajo: sidebar `w-60` colapsa a drawer fijo (`fixed inset-y-0 left-0 z-50 w-64 -translate-x-full`) con botón hamburguesa `fixed top-4 left-4 z-[60] md:hidden` en `AppShell`. Overlay `bg-black/50 md:hidden` bloquea fondo. El drawer se cierra al cambiar de ruta.
- En `md` y arriba: sidebar `w-60 sticky top-0` visible siempre, sin hamburguesa.
- Encabezados de listas: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`; título `text-2xl sm:text-3xl break-words sm:whitespace-nowrap`; buscador `w-full sm:w-64`.
- `<main>` con `p-4 sm:p-8` (en `AppShell` wrapper `pt-16 md:pt-0` reserva espacio para el botón hamburguesa en móvil).
- Nada de `whitespace-nowrap` en títulos a móvil; medir `scrollWidth === innerWidth` al verificar.

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