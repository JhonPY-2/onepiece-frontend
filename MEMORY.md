# MEMORY.md — onepiece-frontend

## Estado actual
- Frontend Next.js 16 (App Router) + React 19 + Tailwind v4.
- Módulos: personajes, tripulaciones, tripulantes, deportes, estadisticas.
- Buscador por nombre en la lista de personajes (homepage `/`): client-side en `ListaPersonajes.js`, que también contiene el encabezado (el buscador va en la fila del título, no sobre el grid).
- Layout responsive: sidebar `w-60` solo en `md+`; en móvil drawer + hamburguesa en `AppShell`; headers `flex-col sm:flex-row`; main `p-4 sm:p-8` con `pt-16 md:pt-0` en wrapper.
- No hay script de tests (solo lint y build).
- `docs/constitution.md` (nuevo): 6 principios innegociables aprobados por el usuario; leer antes de tocar código.
- Spec `specs/001-ranking-personajes/spec.md` (aprobada): ranking de hasta 10 vía `GET /personajes/ranking` (ya ordenado y desempatado por el backend, máx. 10; `tripulacion` texto o null). Frontend muestra sin recortar ni reordenar; textos exactos, estados de carga/vacío/error+reintentar, entrada de sidebar con emoji/estado activo.
- Plan `specs/001-ranking-personajes/plan.md` (creado): Server Component + `loading.js`/`error.js`; en Next.js 16.3+ el botón "Reintentar" usa `retry()` (re-fetch del segmento), no `reset()` (solo limpia el error sin re-consultar).

## Decisiones (y por qué)
- Tripulantes dependientes de una tripulación (sin lista global), para mantener el contexto acotado al crear/editar/ver.
- En `tripulantes/nuevo`, `tripulacion` se envía fijo desde `?tripulacion=ID` (sin select).
- La búsqueda de personajes filtra en el cliente (no hay endpoint de búsqueda y no se tocan contratos del backend). Solo compara `nombre`, ignorando mayúsculas y acentos.
- Sidebar responsive: `w-60` fijo en desktop, drawer en móvil con hamburguesa en `AppShell` (patrón estándar, evita solapamiento con título/buscador).
- Headers responsive: `flex-col sm:flex-row`, títulos con `break-words sm:whitespace-nowrap`, buscador `w-full sm:w-64`.
- Padding responsive: `p-4 sm:p-8` + wrapper `pt-16 md:pt-0` para que el hamburguesa no tape el contenido.

## Aprendizajes y errores a evitar
- `useSearchParams()` requiere `<Suspense>` (ej.: `tripulantes/nuevo`).
- Backend responde `413` si la imagen supera 5MB (usar ese mensaje).
- Preservar transformación de Cloudinary: `replace('/upload/', '/upload/f_auto,q_auto,w_400/')` al renderizar desde backend.
- No pasar documentos de Mongoose a Client Components (`_id` es un `ObjectId`, `tripulacion` viene poblada): aplanar antes con un mapper.
- `src/lib/personajes.js` centraliza `imagenDe`/`resplandorPorNombre`/`imagenPorNombre`; `personajes/[id]/page.js` y `tripulantes/[id]/page.js` aún tienen copias inline.
- Verificar responsive midiendo `documentElement.scrollWidth === innerWidth` a 375px; nada de `whitespace-nowrap` en títulos móviles.

## Próximos pasos
- Spec 001 T1 completada: `vitest.config.mjs` (jsdom, alias `@`→`src`, plugin React, `setupFiles`) y `vitest.setup.js` (`@testing-library/jest-dom/vitest`); scripts `test`/`test:run` en `package.json`. DevDeps instaladas por el usuario en Windows; `npx vitest --version` → `vitest/5.0.3`.
- Conectar el `input type="search"` decorativo de `deportes/page.js` (mismo patrón que personajes).
- Opcional: que `[id]/page.js` importen de `src/lib/personajes.js` para eliminar los helpers duplicados.
- Drawer del sidebar: el cierre solo por cambio de ruta deja overlay sin click-to-close y sin Escape (pendiente si se pide).2026-10-08 23:05 - Spec 001: tasks.md actualizado (separa ListaRanking con tests TL, renumera, quita verificación DevTools de lista vacía)
