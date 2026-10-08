# Constitución — onepiece-frontend

1. **Simplicidad del stack** — Next.js 16 (App Router) + React 19 + Tailwind v4 y nada más; sin librerías, patrones ni capas que no resuelvan un problema real.
2. **La spec manda** — Todo cambio nace en `specs/NNN-*/spec.md`, sigue plan → tareas → código con aprobación explícita entre fases; el código y la doc siempre reflejan la spec aprobada.
3. **Lógica separada de la interfaz** — La lógica pura (filtros, mappers, validaciones, normalización) vive en `src/lib/` como funciones testables; los componentes solo orquestan y presentan.
4. **Verificación obligatoria** — Lógica probada con Vitest + Testing Library (tests primero); interfaz verificada con `npm run lint`, `npm run build` y Chrome DevTools **siempre en modo solo lectura** (nunca crear, editar ni borrar datos desde la interfaz: el backend puede estar conectado a la base real). Tests, lint y build los corre el usuario desde PowerShell; el agente da el comando exacto.
5. **Contrato con el backend** — El frontend consume únicamente campos que la API de `http://localhost:3000` devuelve o ya se usan; nunca se inventan campos ni se tocan contratos.
6. **Español siempre** — Textos de interfaz, comentarios, documentación, specs y mensajes en español.
