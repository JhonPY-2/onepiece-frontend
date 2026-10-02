# MEMORY.md — onepiece-frontend

## Estado actual
- Frontend Next.js 16 (App Router) + React 19 + Tailwind v4.
- Módulos: personajes, tripulaciones, tripulantes, deportes, estadisticas.
- No hay script de tests (solo lint y build).

## Decisiones (y por qué)
- Tripulantes dependientes de una tripulación (sin lista global), para mantener el contexto acotado al crear/editar/ver.
- En `tripulantes/nuevo`, `tripulacion` se envía fijo desde `?tripulacion=ID` (sin select).

## Aprendizajes y errores a evitar
- `useSearchParams()` requiere `<Suspense>` (ej.: `tripulantes/nuevo`).
- Backend responde `413` si la imagen supera 5MB (usar ese mensaje).
- Preservar transformación de Cloudinary: `replace('/upload/', '/upload/f_auto,q_auto,w_400/')` al renderizar desde backend.

## Próximos pasos
- (vacío por ahora)