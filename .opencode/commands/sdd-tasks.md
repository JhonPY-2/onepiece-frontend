---
description: Generar tasks.md para una spec
agent: plan
---

Use the skill: sdd

Genera `specs/$1/tasks.md` siguiendo la skill sdd.

Reglas:
- Máximo **10 tareas** por spec. Si salen más, **propón dividir la spec**.
- Cada tarea: máximo 20-30 minutos.
- Formato: `- [ ] **Tn. Descripción.** RF-x, RF-y` con línea `  - Hecho cuando: ...`
- Incluir Tests (de lógica pura en `src/lib/`), Código y Hecho cuando.
- Para tareas con UI, el "Hecho cuando" debe ser **verificable con Chrome DevTools**: qué se ve, en qué viewport (incluye la **vista móvil de 375 px**) y qué pasa al hacer clic.
- Orden lógico (tests de lógica primero donde aplique).
- Si esta es la **primera spec**, la tarea T1 es instalar **Vitest + Testing Library** (requiere aprobación explícita del usuario).

$ARGUMENTS