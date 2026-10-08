---
description: Revisar docs/constitution.md (si existe) y proponer 6 principios innegociables
agent: plan
---

Crea un borrador de **6 principios innegociables** para este proyecto, basándote en lo que ya exista en `docs/constitution.md` (si no existe, propón los principios revisando el código). **No escribas ni modifiques ningún archivo hasta que yo te dé mi aprobación explícita.**

Antes de proponer, lee `AGENTS.md`, `MEMORY.md` y al menos los archivos principales del código (`src/lib/api.js`, `src/app/page.js`, `src/components/AppShell.js`, `package.json`). Ten en cuenta: este es un frontend **Next.js 16 (App Router) + React 19 + Tailwind v4** en `http://localhost:3001` que consume el backend por HTTP en `http://localhost:3000`.

Los 6 principios deben cubrir, en este orden:
1. **Simplicidad del stack** (Next.js + React + Tailwind, sin sobre-ingeniería).
2. **Relación spec-código** (la spec manda; el código y la doc deben reflejarla).
3. **Lógica separada de la interfaz** (funciones puras en `src/lib/`).
4. **Política de tests y verificación** (Vitest + Testing Library para lógica; lint, build y Chrome DevTools para interfaz).
5. **Contrato con el backend** (no inventar campos que la API no devuelve).
6. **Idioma español** (textos y documentación).

Máximo **15 líneas**.

$ARGUMENTS