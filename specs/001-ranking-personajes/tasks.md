# specs/001-ranking-personajes/tasks.md

**Estado: borrador**

## Tareas

- [x] **T1. Instalar Vitest + Testing Library (configuración base).** (Sin RF directo)
  - Tests: Ninguno (tarea de setup). Verificar que `vitest.config.*` y `vitest.setup.*` configuren `jsdom`, alias `@/*` → `src/*`, `setupFiles` con `@testing-library/jest-dom` y procesado de JSX para archivos `.js` (`@vitejs/plugin-react`).
  - Código: Antes de instalar, **solicitar al usuario que compruebe el espacio libre en C:** (el usuario lo revisa). Instalar dependencias de desarrollo: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@vitejs/plugin-react`. Crear `vitest.config.mjs` (o ajustar existente) con entorno `jsdom`, `setupFiles`, alias `@/*` → `src/*` y plugin de React para soportar JSX en `.js`. Añadir script `test`/`test:run` si no existe, sin romper `npm run lint` ni `npm run build`. **Esperar aprobación explícita del usuario** para proceder con la instalación.
  - Hecho cuando: `npx vitest --version` devuelve versión; la configuración carga sin error; espacio libre en C: verificado por el usuario; instalación realizada solo con aprobación explícita (cumple AGENTS.md). Verificable con lectura de archivos creados.

- [x] **T2. Crear `src/lib/ranking.js` y tests de formateadores + validación (lógica pura, TDD).** RF-6, RF-7, RF-8, RF-9
  - Tests: Crear `src/lib/ranking.test.js`. Casos: `formatearRecompensa(recompensa)` devuelve `${Number(recompensa).toLocaleString()} berries`; `formatearTripulacion(null|undefined|'')` → `"Sin tripulación"`; `formatearTripulacion('Sombrero de Paja')` → texto tal cual; `esListaRankingValida([])` → `true`; `esListaRankingValida` con entrada válida → `true`; `esListaRankingValida` con cuerpo inválido (no array, campos faltantes, `recompensa` no numérica/no finita, `tripulacion` tipo incorrecto) → `false`. Los tests deben **fallar** antes de escribir el código.
  - Código: Implementar `formatearRecompensa`, `formatearTripulacion`, `esListaRankingValida` en `src/lib/ranking.js`, sin JSX, sin fetch, sin estado React. Seguir exactamente la firma/semántica del plan.
  - Hecho cuando: Tests fallan inicialmente (TDD) y luego pasan con implementación pura.

- [x] **T3. Tests + código para `aListaRanking` y `obtenerRanking` (lógica pura + fetch simulado).** RF-1, RF-4, RF-9, RNF-3
  - Tests: Ampliar `src/lib/ranking.test.js` con: `aListaRanking` conserva el **orden exacto** recibido y normaliza `tripulacion` ausente a `null`; `obtenerRanking` usa `API_URL` de `@/lib/api`, `cache: 'no-store'`, sin parámetros; con `respuesta.ok === false` lanza error; con JSON inválido para el shape lanza error (cuerpo inválido); con lista válida devuelve array mapeado preservando orden. Usar mocks de `global.fetch` (Vitest). Los tests deben **fallar** antes del código.
  - Código: Implementar `aListaRanking(datos)` (preserva orden) y `obtenerRanking()` en `src/lib/ranking.js`: `fetch(\`${API_URL}/personajes/ranking\`, { cache: 'no-store' })`; si `!respuesta.ok` → `throw new Error('respuesta no exitosa')`; parsea JSON (si falla debe propagarse); valida con `esListaRankingValida` → `throw new Error('cuerpo inválido')` si inválido; devuelve `aListaRanking(datos)`. No modificar `API_URL` (RNF-3).
  - Hecho cuando: Tests fallan antes de código (TDD) y pasan. `obtenerRanking` usa `API_URL` y `cache: 'no-store'`.

- [ ] **T4. Crear `src/components/ListaRanking.js` con tests de Testing Library (presentación).** RF-4, RF-5, RF-7, RF-8
  - Tests: Crear `src/components/ListaRanking.test.js` con: lista vacía → muestra `"No hay personajes en el ranking"`; 3 entradas en el mismo orden con posiciones 1, 2, 3, mostrando nombre, `formatearRecompensa` y `formatearTripulacion`; entrada con `tripulacion: null` → muestra `"Sin tripulación"`. Los tests deben **fallar** antes del código.
  - Código: Crear `src/components/ListaRanking.js` (sin `'use client'`) que recibe `{ entradas }`, importa `formatearRecompensa` y `formatearTripulacion` desde `@/lib/ranking`, renderiza `<ol className="space-y-2">` con `<li>` por entrada mostrando posición `i + 1`, nombre, recompensa formateada y tripulación formateada; si `!Array.isArray(entradas)` o `entradas.length === 0` → muestra `<p>No hay personajes en el ranking</p>`. Sin fetch, sin estado ni eventos.
  - Hecho cuando: Tests de Testing Library fallan inicialmente (TDD) y luego pasan.

- [ ] **T5. Crear ruta `/ranking`: `page.js` (Server Component), `loading.js` y `error.js` con `retry()`.** RF-1–RF-5, RF-8, RF-9, RF-11, RF-12
  - Tests: Ninguno (UI). Cobertura lógica y presentación en T2–T4.
  - Código: `src/app/ranking/page.js` (async Server Component): importa `obtenerRanking` desde `@/lib/ranking` e importa `ListaRanking` desde `@/components/ListaRanking`; `<main className="min-h-screen bg-navy p-4 sm:p-8"><div className="max-w-3xl mx-auto">` con `<h1>Ranking de recompensas</h1>` (RF-2); renderiza `<ListaRanking entradas={entradas} />`. Sin guard de auth (RF-12). `src/app/ranking/loading.js` → `"Cargando ranking…"`. `src/app/ranking/error.js` (Client Component) → `"No se pudo cargar el ranking. Inténtalo de nuevo."` y botón `"Reintentar"` que llama a `retry()` (RF-9).
  - Hecho cuando: **Chrome DevTools (solo lectura)** contra `http://localhost:3001/ranking` — Estado carga: muestra "Cargando ranking…". Tras resolución: todas las entradas en el orden devuelto por backend, con posición (1-based), nombre, recompensa y tripulación. Vista **móvil 375 px**: una sola columna, ancho máximo 768 px, sin scroll horizontal (`document.documentElement.scrollWidth === innerWidth`), sin desbordes. Ruta pública visible con/sin sesión. Consola sin errores. **No se requiere** verificar lista vacía real con DevTools (cubierto por test T4).

- [ ] **T6. Sidebar: añadir entrada "Ranking" con emoji y estado activo.** RF-10
  - Tests: Ninguno (UI).
  - Código: Modificar `src/components/Sidebar.js` para añadir enlace `"Ranking"` (emoji) a `/ranking`, con estado activo cuando `pathname === '/ranking'`. Mantener estilo/estructura existente, sin tocar otras secciones.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — Entrada "Ranking" visible con emoji, enlace a `/ranking`, estado activo en `/ranking`. Verificado con sesión iniciada y sin sesión, en **vista móvil 375 px** (drawer) y en `md+`. Consola sin errores.

- [ ] **T7. Detalle del personaje: usar `formatearRecompensa` (cambio mínimo).** RF-6
  - Tests: Ninguno (refactor mínimo).
  - Código: Modificar `src/app/personajes/[id]/page.js` para reemplazar `personaje.recompensa.toLocaleString()` por `formatearRecompensa(personaje.recompensa)`, importando desde `@/lib/ranking`. Sin otros cambios.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — En `/personajes/:id` el texto de recompensa coincide exactamente con el formato `${toLocaleString()} berries` usado en `/ranking` para el mismo número.

- [ ] **T8. Validación de error con `retry()` (casos límite RF-9).** RF-9
  - Tests: Ninguno (UI).
  - Código: `src/app/ranking/error.js` se crea en T5. En esta tarea solo se comprueba su comportamiento: que usa `retry()` (no `reset()`), que el mensaje exacto es `"No se pudo cargar el ranking. Inténtalo de nuevo."` y que el botón `"Reintentar"` existe. Error boundary cubre el segmento `/ranking`.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — Simulando fallo (backend detenido o respuesta no exitosa/cuerpo inválido), aparece mensaje exacto + botón "Reintentar". Al pulsar "Reintentar", `retry()` relanza la petición `GET /personajes/ranking` (Network muestra nueva request); si vuelve a fallar, vuelve a mostrar el error. Solo lectura.

- [ ] **T9. Verificación final contra criterios de finalización (lint/build + trazabilidad).** RF-1–RF-12, RNF-1–RNF-3
  - Tests: Ejecutar Vitest con comando exacto: `npx vitest run src/lib/ranking.test.js src/components/ListaRanking.test.js`. Todos los tests creados en T2–T4 deben pasar.
  - Código: Comprobar mapeo RF→tests→implementación; actualizar `MEMORY.md` con estado actual, decisiones importantes (con su porqué: Server Component + `loading.js` + `error.js` con `retry()`, lógica pura en `src/lib/ranking.js`, `ListaRanking` como componente de presentación sin `'use client'` (render server) testeable con Testing Library, formateador compartido, ruta pública, ancho máx 768 px + 375 px sin scroll) y errores a evitar. Revisar RNF-1 (solo GET/lectura), RNF-2 (textos en español), RNF-3 (usa `API_URL`).
  - Hecho cuando: `npm run lint` y `npm run build` pasan (comandos exactos desde PowerShell). Criterios de finalización verificados con **Chrome DevTools (solo lectura)**: comparación orden/backend, posiciones, formato compartido con detalle, tripulación null→"Sin tripulación", retry relanza petición, sidebar con/sin sesión y estado activo, **375 px** sin scroll horizontal (`scrollWidth === innerWidth`), ancho máx 768 px. Especificación lista para marcar `implementada`.
```