---
description: Generar plan.md para una spec
agent: plan
---

Use the skill: sdd

Genera `specs/$1/plan.md` siguiendo exactamente la plantilla/estructura de la skill sdd.

Requisitos previos:
- `specs/$1/spec.md` debe existir.
- Si la spec no está **aprobada** o tiene alguna entrada con `[NECESITA ACLARACIÓN]`, **PARA y avisa**. No generes plan.

Contenido obligatorio según skill:
1. Archivos a crear/modificar y responsabilidades (arquitectura del proyecto: `src/app/` rutas/páginas, `src/lib/` lógica pura y llamadas a la API, `src/components/` componentes)
2. Lógica (algoritmo/pseudocódigo) que cubra todos los RF
3. Decisiones técnicas justificadas (tabla: Decisión, Justificación, Alternativa descartada)
4. Estrategia de tests y verificación: **lógica** en funciones puras probadas con **Vitest + Testing Library** (aún no instalados; instalarlos será la primera tarea de la primera spec); **interfaz** NO con unit tests sino con `npm run lint`, `npm run build` y **Chrome DevTools** (solo lectura). Indicar qué RF cubre cada test.
5. Mapeo RF → implementación/tests

El agente NO ejecuta tests, lint ni build: el usuario los corre desde PowerShell.

$ARGUMENTS