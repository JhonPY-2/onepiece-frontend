# specs/001-ranking-personajes/plan.md

## 1. Archivos a crear/modificar y responsabilidades

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/lib/ranking.js` | Crear | Lógica pura y llamada a la API del ranking. Sin JSX ni estado de React. |
| `src/app/ranking/page.js` | Crear | Server Component de la ruta `/ranking`: fetch + `<main>` + render del título y la lista. Sin lógica de formato inline. |
| `src/app/ranking/loading.js` | Crear | Fallback de Suspense/streaming: muestra "Cargando ranking…" mientras el Server Component resuelve el fetch. |
| `src/app/ranking/error.js` | Crear | Client Component (error boundary del segmento): muestra el mensaje de error y el botón "Reintentar" que llama a `retry()`. |
| `src/components/ListaRanking.js` | Crear | Componente de presentación (sin estado ni eventos) que recibe las entradas ya validadas y renderiza la lista `<ol>` o el texto "No hay personajes en el ranking". |
| `src/components/Sidebar.js` | Modificar | Añadir la entrada "Ranking" (emoji) enlazada a `/ranking` con estado activo. |
| `src/app/personajes/[id]/page.js` | Modificar (mínimo) | Reemplazar `personaje.recompensa.toLocaleString()` por `formatearRecompensa` para garantizar que RF-6 use exactamente el mismo formateo. |
| `src/lib/ranking.test.js` | Crear | Tests de Vitest de las funciones puras de `src/lib/ranking.js`. |
| `src/components/ListaRanking.test.js` | Crear | Tests de Testing Library para `src/components/ListaRanking.js`. |
| `package.json` | Modificar | Añadir Vitest + Testing Library y script `test` (primera tarea de la spec). |

**Detalle de `src/lib/ranking.js`**
- `formatearRecompensa(recompensa)` → `` `${Number(recompensa).toLocaleString()} berries` ``. Reutilizable por `/ranking` y por el detalle (RF-6).
- `formatearTripulacion(tripulacion)` → `'Sin tripulación'` si `null`/`undefined`/`''`; si no, `String(tripulacion)` (RF-7).
- `esListaRankingValida(datos)` → `Array.isArray(datos)` y cada entrada tiene `nombre` string, `recompensa` número finito y `tripulacion` string o `null` (RF-9, valida cuerpo).
- `aListaRanking(datos)` → mapea cada entrada a `{ nombre, recompensa, tripulacion }` **preservando el orden recibido** (RF-4).
- `obtenerRanking()` → `fetch(`${API_URL}/personajes/ranking`, { cache: 'no-store' })`; si `!respuesta.ok`, `throw new Error(...)`; parsea JSON y, con `esListaRankingValida`, `throw` si es inválido; devuelve `aListaRanking(datos)` (RF-1, RF-9).

**Detalle de `src/app/ranking/page.js`**
- `export default async function Ranking()`: `const entradas = await obtenerRanking()`.
- `<main className="min-h-screen bg-navy p-4 sm:p-8">` con contenedor `max-w-3xl mx-auto` (RF-11).
- Título `<h1>` "Ranking de recompensas" (RF-2).
- Si `entradas.length === 0` → "No hay personajes en el ranking" (RF-8).
- Si no, `<ol>` de una sola columna; cada `<li>` muestra, en orden: posición (`índice + 1`), nombre, `formatearRecompensa`, `formatearTripulacion` (RF-5).
- Sin guard de auth: la ruta es pública (RF-12). No enlaza cada entrada (fuera de alcance: el endpoint no devuelve `id`).

## 2. Lógica (pseudocódigo)

```
// src/lib/ranking.js
import { API_URL } from '@/lib/api'

formatearRecompensa(recompensa):
    return `${Number(recompensa).toLocaleString()} berries`

formatearTripulacion(tripulacion):
    return (tripulacion === null || tripulacion === undefined || tripulacion === '')
        ? 'Sin tripulación'
        : String(tripulacion)

esListaRankingValida(datos):
    SI !Array.isArray(datos): return false
    return datos.every(e =>
        e && typeof e.nombre === 'string'
          && typeof e.recompensa === 'number' && Number.isFinite(e.recompensa)
          && (e.tripulacion === null || typeof e.tripulacion === 'string'))

aListaRanking(datos):            // preserva orden
    return datos.map(e => ({
        nombre: e.nombre,
        recompensa: e.recompensa,
        tripulacion: e.tripulacion ?? null
    }))

obtenerRanking():
    respuesta ← fetch(`${API_URL}/personajes/ranking`, { cache: 'no-store' })
    SI !respuesta.ok: throw Error('respuesta no exitosa')
    datos ← await respuesta.json()      // si el parseo falla, el throw lo captura error.js
    SI !esListaRankingValida(datos): throw Error('cuerpo inválido')
    return aListaRanking(datos)

// src/components/ListaRanking.js  (presentación, sin 'use client')
ListaRanking({ entradas }):
    SI (no Array.isArray(entradas) OR entradas.length === 0):
        return <p>No hay personajes en el ranking</p>
    return:
        <ol className="space-y-2">
            PARA (i, e) EN entradas:
                <li>
                    span posición = i + 1
                    span nombre = e.nombre
                    span recompensa = formatearRecompensa(e.recompensa)
                    span tripulación = formatearTripulacion(e.tripulacion)
                </li>
        </ol>

// src/app/ranking/page.js  (Server Component)
Ranking():
    entradas ← await obtenerRanking()   // fallo => error.js; pendiente => loading.js
    return:
        <main className="min-h-screen bg-navy p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <h1>Ranking de recompensas</h1>
                <ListaRanking entradas={entradas} />
            </div>
        </main>

// src/app/ranking/error.js  (Client Component)
Error({ retry }):
    div:
      p "No se pudo cargar el ranking. Inténtalo de nuevo."
      button onClick=retry: "Reintentar"   // retry() re-encarga los datos al servidor y re-renderiza
```

## 3. Decisiones técnicas justificadas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| `page.js` como Server Component + `loading.js` + `error.js` | Mantiene la convención de `AGENTS.md` (fetch en Server Component), da carga/streaming nativo y un error boundary idiomático con `retry()` para "Reintentar". Además, al renderizar en servidor, `toLocaleString()` usa el mismo entorno que el detalle (también server) y RF-6 queda garantizado. | Fetch en Client Component con `useState`/`useEffect`: rompe la convención, y `toLocaleString()` en el navegador podría no coincidir con el del detalle server-renderizado. |
| `ListaRanking.js` como componente de presentación (sin 'use client') | Separa la vista del fetch (Server Component). Al no ser Client Component, el render ocurre en el servidor cuando lo usa `page.js`, lo que garantiza que `toLocaleString()` usado por `formatearRecompensa` se ejecute en el mismo entorno que en `/personajes/[id]` (también server-renderizado), asegurando RF-6. Además se puede probar con Testing Library (renderizado en entorno jsdom). | Añadir `'use client'`: forzaría a renderizar en el navegador, pudiendo dar un locale distinto en `toLocaleString()` frente al render server del detalle; también movería innecesariamente la presentación al cliente. Render directamente en `page.js`: `page.js` es Server Component asíncrono, difícil de testear con Testing Library de forma aislada. |
| `loading.js` para "Cargando ranking…" | Es el mecanismo de Suspense del App Router; el texto aparece durante el fetch sin estado manual. | Estado `cargando` manual o `<Suspense>` con fallback en la propia página. |
| Error boundary con el prop `retry()` (estable desde Next.js 16.3.0) | **Comprobado en la documentación de Next.js 16 (`error.js`, v16.3.0):** `retry()` "try to re-fetch and re-render the error boundary's children", es decir, vuelve a pedir los datos al servidor; encaja con RF-9. El proyecto usa `next@16.3.5`, así que el prop está disponible. Con `cache: 'no-store'`, el re-fetch del Server Component es fresco. | `reset()` solo: la doc dice que "clear the error state and re-render ... **without re-fetching** the contents", por lo que no basta para RF-9. También se descarta `reset()` + `router.refresh()` dentro de `startTransition` (patrón de versiones anteriores, innecesario ahora y con más código). |
| Lógica pura en `src/lib/ranking.js` | Constitución principio 3: lógica separada y testable con Vitest; los componentes solo orquestan. | Funciones de formato/validación inline en `page.js` (no testeables de forma aislada). |
| `formatearRecompensa` compartido entre `/ranking` y el detalle | RF-6 exige el mismo texto; una única función elimina la posibilidad de divergencia. | Duplicar `toLocaleString() + ' berries'` en ambas páginas. |
| `obtenerRanking()` en `src/lib/` | La skill ubica en `src/lib/` las llamadas a la API; centraliza fetch + validación y deja la página delgada. | Fetch embebido en `page.js` (como en las páginas actuales). |
| Ruta pública sin guard de auth | RF-12: el ranking se ve con o sin sesión; no hay datos sensibles. | Exigir sesión con `useAuth` (contradice RF-12). |
| Emoji 🏆 en la entrada "Ranking" | Consistencia con las demás entradas del sidebar, que ya usan emoji (sin añadir librería de iconos). | Icono SVG o librería externa. |
| `max-w-3xl mx-auto` + lista de una columna | RF-11: ancho máximo 768 px (`max-w-3xl`) y sin scroll horizontal a 375 px. | Grid multilínea o `whitespace-nowrap`. |

### Verificación en la documentación de Next.js 16 (RF-9)

- **Qué se comprobó:** en `https://nextjs.org/docs/app/api-reference/file-conventions/error` (v16.4.0, `lastUpdated: 2026-10-06`), el historial de versiones indica que `retry` es estable desde `v16.3.0`. El prop `retry()` "will try to **re-fetch and re-render** the error boundary's children". El prop `reset()`, en cambio, "clear the error state and re-render the error boundary's children **without re-fetching** the contents".
- **Qué se decidió:** usar `retry()` como acción del botón "Reintentar". Es el mecanismo previsto para volver a pedir datos al servidor cuando el error nace en el Server Component.
- **Alternativa descartada:** `reset()` + `router.refresh()` dentro de `startTransition` (patrón necesario en versiones antiguas o si no existiera `retry`; no aporta nada con `next@16.3.5`). `router.refresh()` sí re-encarga el Server Component, pero combinarlo con `reset()` añade complejidad innecesaria.

## 4. Estrategia de tests y verificación

**Lógica — Vitest + Testing Library (primera tarea de la spec instala las dependencias).**
Archivo `src/lib/ranking.test.js`. Comandos que ejecuta el usuario desde PowerShell:
`npx vitest run src/lib/ranking.test.js src/components/ListaRanking.test.js`, `npm test`.

| Test | Cubre | Comportamiento esperado |
|---|---|---|
| `formatearRecompensa` con un número | RF-6 | Devuelve `Number(n).toLocaleString()` + `" berries"` (p. ej. `3300000000` → texto con separadores + " berries"). |
| `formatearTripulacion(null)` / `undefined` / `''` | RF-7 | Devuelve `"Sin tripulación"`. |
| `formatearTripulacion('Sombrero de Paja')` | RF-5, RF-7 | Devuelve el texto de la tripulación tal cual. |
| `esListaRankingValida([])` | RF-8 | `true` (lista vacía es válida; el vacío se muestra, no es error). |
| `esListaRankingValida(entradaVálida)` | RF-9 | `true` para `{nombre, recompensa, tripulacion}` correctos. |
| `esListaRankingValida` con cuerpo inválido (no array / campos faltantes / `recompensa` no numérica/no finita) | RF-9 | `false`. |
| `aListaRanking` con 3 entradas | RF-4, RF-5 | Conserva el orden exacto y normaliza `tripulacion` ausente a `null`. |
| `ListaRanking` renderiza lista vacía | RF-8 | Muestra `"No hay personajes en el ranking"`. |
| `ListaRanking` renderiza 3 entradas en mismo orden con posiciones 1, 2, 3 | RF-4, RF-5 | Cada entrada muestra posición correcta y datos; conserva orden recibido. |
| `ListaRanking` con `tripulacion` null | RF-7 | Muestra `"Sin tripulación"` para esa entrada. |

**Interfaz — NO unit tests (excepto `ListaRanking` con Testing Library).** Se verifica con:
- `npm run lint` y `npm run build` (los ejecuta el usuario en PowerShell).
- MCP Chrome DevTools (solo lectura) contra `http://localhost:3001`:
  - RF-1/RF-3/RF-4/RF-5: abrir `/ranking`, ver "Cargando ranking…", luego todas las entradas en el orden del backend con posición, nombre, recompensa y tripulación; comparar con la respuesta del backend.
  - RF-2: título "Ranking de recompensas".
  - RF-6: comparar el texto de recompensa entre `/ranking` y `/personajes/:id`.
  - RF-7: entrada con `tripulacion` null → "Sin tripulación". RF-8 se verifica con test de `ListaRanking`.
  - RF-9: con el backend detenido o respuesta inválida → mensaje de error + "Reintentar", y al pulsarlo se relanza la petición al servidor (verificar de nuevo la request en Network).
  - RF-10/RF-12: entrada "Ranking" en el sidebar con emoji y estado activo, con y sin sesión.
  - RF-11: a 375 px, una sola columna, ancho máx. 768 px y `documentElement.scrollWidth === innerWidth`.
- Regla de seguridad: solo lectura; nunca crear/editar/borrar. El backend del puerto 3000 puede apuntar a la base real.

## 5. Mapeo RF → implementación/tests

| RF | Implementación | Verificación |
|---|---|---|
| RF-1 | `obtenerRanking()` en `src/lib/ranking.js` (fetch sin params, `no-store`) | DevTools: Network muestra `GET /personajes/ranking` sin query |
| RF-2 | `<h1>` en `src/app/ranking/page.js` | DevTools |
| RF-3 | `src/app/ranking/loading.js` | DevTools (estado de carga) |
| RF-4 | `aListaRanking` preserva orden + `ListaRanking` renderiza sin `.sort()`/slice | Test `aListaRanking` + test de `ListaRanking` (orden y posiciones) + DevTools comparando con backend |
| RF-5 | `ListaRanking` renderiza `<ol>` con `i + 1`, nombre, recompensa, tripulación | Test `ListaRanking` + DevTools |
| RF-7 | `formatearTripulacion` + `ListaRanking` muestra "Sin tripulación" | Test `formatearTripulacion(null)` + test `ListaRanking` (tripulacion null) + DevTools |
| RF-8 | `ListaRanking` muestra "No hay personajes en el ranking" cuando array vacío | Test `ListaRanking` (lista vacía) |
| RF-9 | `throw` en `obtenerRanking` (no-ok/cuerpo inválido) + `error.js` con `retry()` | Tests de `esListaRankingValida` + DevTools con backend detenido |
| RF-10 | Link "Ranking" en `src/components/Sidebar.js` | DevTools (emoji + estado activo) |
| RF-11 | `max-w-3xl mx-auto`, lista de una columna | DevTools a 375 px (`scrollWidth === innerWidth`) |
| RF-12 | Ruta sin guard de auth | DevTools con y sin sesión |
| RNF-1 | Solo `fetch` GET | Revisión de código |
| RNF-2 | Textos en español | DevTools + lint |
| RNF-3 | `API_URL` de `@/lib/api` | Revisión de código |
