---
description: "Implementar UNA tarea: /sdd-implement 002-nombre T3"
agent: build
---

Use the skill: sdd

Implementa **SOLO** la tarea $2 de `specs/$1/tasks.md`.

Reglas estrictas (skill sdd):
1. **Una sola tarea cada vez**.
2. **Tests de lógica primero** (TDD, funciones puras en `src/lib/`). Deja claro que **fallan** (antes de escribir código). **NO los ejecutes tú**.
3. **Escribe código** hasta que los tests cubran lo que pide la tarea.
4. **NO ejecutes `npm test`, `vitest`, `npm run build` ni `npm run lint`**. Yo los corro desde **PowerShell**. **Dame el comando exacto** (p. ej. `npx vitest run <archivo>`, `npm run lint`, `npm run build`).
5. **NO arranques `npm run dev` (puerto 3001) ni el backend (puerto 3000)**: yo los tengo levantados en otras pestañas. Si `http://localhost:3001` o el backend no responden, **PARA y avisa**.
6. **Verificación de interfaz con Chrome DevTools** (si la tarea tiene requisitos de UI): abre `http://localhost:3001`, comprueba el flujo, revisa la consola por errores y toma capturas, incluida la **vista móvil de 375 px**. **Ve contándome qué compruebas** para que yo lo vea en el navegador. **Solo acciones de LECTURA** (navegar, filtrar, buscar, scroll, abrir detalles): **NUNCA** crear, editar ni borrar datos ni enviar formularios que escriban. Si hace falta probar escrituras, pídeme primero que levante el backend contra la base de pruebas y **espera mi confirmación**.
7. **Marca la tarea como completada** (`[x]`) en `specs/$1/tasks.md` **ÚNICAMENTE cuando yo confirme** que los tests pasan y la verificación es correcta.
8. **Sin commit**.
9. **PÁRATE** al terminar. No empieces otra tarea.

$ARGUMENTS