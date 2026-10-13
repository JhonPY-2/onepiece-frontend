# specs/002-chat-ia/tasks.md

**Estado: borrador**

## Tareas

- [x] **T1. Lógica pura en `src/lib/chat.js` con tests (TDD).** RF-7, RF-8, RF-9, RF-17, RF-22
  - Tests: Crear `src/lib/chat.test.js` antes del código (deben **fallar** primero). Casos: `esMensajeVacio('')`, `'   '`, `' \n\t '`, `null`, `undefined` → `true`; `'hola'`, `'  hola '` → `false`; `RESPUESTA_DEMO` empieza por `"(Respuesta de demostración)"` y coincide con el texto exacto de RF-7; `ESPERA_MS` entre 1500 y 3000; `crearMensaje('x','usuario',1)` → `{ id:1, autor:'usuario', texto:'x' }`; `enviarMensajeChat('x')` resuelve `RESPUESTA_DEMO` (fake timers); dos mensajes distintos → mismo `RESPUESTA_DEMO`.
  - Código: Crear `src/lib/chat.js` (sin JSX, sin React, sin estado) exportando `RESPUESTA_DEMO`, `ESPERA_MS = 2000`, `esMensajeVacio`, `crearMensaje` y `enviarMensajeChat` (único punto reemplazable RF-17: espera `ESPERA_MS` y devuelve `RESPUESTA_DEMO`). Sin `fetch`.
  - Hecho cuando: `npx vitest run src/lib/chat.test.js` pasa en verde (tras verlos en rojo), ejecutado por el usuario en PowerShell.

- [x] **T2. Ruta `/chat` y componentes de presentación (esqueleto estático).** RF-1, RF-2, RF-3, RF-14, RF-26
  - Tests: Ninguno (UI).
  - Código: Crear `src/app/chat/page.js` (Server Component delgado: `<main>` + `<Chat />`), `src/app/chat/Chat.js` (`'use client'`, layout `flex flex-col h-[calc(100dvh-4rem)] md:h-screen`, `<h1>Chat de One Piece</h1>`, estado vacío con el saludo y las tres sugerencias exactas, foco inicial), `src/components/ListaMensajes.js` y `src/components/CajaMensaje.js` (presentación). Aún sin lógica de envío.
  - Hecho cuando: **Chrome DevTools (solo lectura)** en `http://localhost:3001/chat` — se ven el título "Chat de One Piece", el saludo "¡Hola! Soy tu asistente de One Piece. ¿Sobre qué quieres preguntar?" y las tres sugerencias exactas; la caja multilínea y el botón "Enviar" son visibles; el foco está en el textarea al abrir `/chat`. Consola sin errores.

- [x] **T3. Flujo de envío: burbujas, "escribiendo…", respuesta demo y auto-scroll.** RF-4, RF-5, RF-6, RF-7, RF-8, RF-10, RF-12, RF-22
  - Tests: Ninguno (UI); la lógica ya está cubierta en T1.
  - Código: Conectar en `Chat.js` `enviar(valor)` usando `@/lib/chat`: añade burbuja de usuario, vacía la caja, muestra "escribiendo…" y al terminar añade la burbuja de asistente con la respuesta fija; `onClick` de las tres sugerencias llama a `enviar`; `useEffect([mensajes, escribiendo])` hace `scrollIntoView`.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — al pulsar una sugerencia o escribir y pulsar Enter aparece la burbuja del usuario, la caja queda vacía, se ve "escribiendo…" entre 1,5 y 3 s (cronometrado) y luego la respuesta fija "(Respuesta de demostración) …"; con muchos mensajes el último queda visible (auto-scroll).

- [x] **T4. Guardas: mensaje vacío y prevención de doble envío.** RF-9, RF-11
  - Tests: Ninguno (UI); `esMensajeVacio` ya probado en T1.
  - Código: En `Chat.js`, `enviar` sale si `esMensajeVacio(valor)`; añadir `enviandoRef` (`useRef`) como guard síncrono y `try/finally` para liberar siempre `enviandoRef.current = false` y `setEscribiendo(false)`. En `CajaMensaje.js`, botón `disabled={deshabilitado}` mientras se escribe.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — enviar con la caja vacía, con solo espacios o con solo saltos no añade burbujas; durante "escribiendo…" el botón "Enviar" está deshabilitado y pulsar Enter o el botón repetidamente no añade mensajes ni respuestas duplicadas.

- [x] **T5. Composer multilínea: Enter/Shift+Enter y máximo 6 líneas con scroll interno.** RF-20, RF-21, RF-23, RF-24
  - Tests: Ninguno (UI).
  - Código: En `CajaMensaje.js`, `textarea` con `leading-6`, `resize-none`, `field-sizing-content`, `max-h-[10.5rem]` (6 líneas) y `overflow-y-auto`; en `Chat.js`, `onKeyDown`: Enter sin Shift → `preventDefault()` + `enviar`; Shift+Enter no se previene.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — Enter envía sin insertar salto; Shift+Enter inserta salto sin enviar; al superar 6 líneas la caja no crece y aparece scroll interno (`scrollHeight > clientHeight`).

- [x] **T6. Burbujas: lados/colores distintos y texto literal.** RF-13, RF-27
  - Tests: Ninguno (UI).
  - Código: En `ListaMensajes.js`, contenedor `justify-end`/`justify-start` y burbuja `bg-gold text-white` (usuario) vs `bg-white/10 text-white` (asistente), `rounded-2xl`; renderizar `{m.texto}` (React escapa), sin `dangerouslySetInnerHTML`.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — las burbujas de usuario y asistente se ven en lados opuestos y con colores de fondo distintos; enviar `<b>hola</b>`, `<script>` y `&` se muestran como texto literal (sin negrita ni ejecución de script).

- [ ] **T7. Sidebar: entrada "💬 Chat" con estado activo.** RF-15, RF-19
  - Tests: Ninguno (UI).
  - Código: En `src/components/Sidebar.js`, añadir en el primer `<nav>` (visible con y sin sesión) un `Link` `href="/chat"` con texto `💬 Chat` y `chatActivo = pathname?.startsWith('/chat')` → `bg-gold/15` cuando activo. Sin tocar otras entradas.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — la entrada "💬 Chat" es visible con y sin sesión, enlaza a `/chat` y muestra estado activo en `/chat`; en **375 px** se ve en el drawer y en `md+` en el sidebar.

- [ ] **T8. Historial efímero y sin persistencia.** RF-16, RF-25, RNF-3
  - Tests: Ninguno (UI).
  - Código: Confirmar que el historial vive solo en el estado local de `Chat.js` (nada en `localStorage`/cookies ni en store global/contexto). Sin cambios si T2/T3 ya cumplen; si hay persistencia, eliminarla.
  - Hecho cuando: **Chrome DevTools (solo lectura)** — tras enviar mensajes, recargar `/chat` vuelve al estado vacío; salir a otra sección y volver por navegación del lado del cliente muestra el estado vacío; Storage sin datos del chat.

- [ ] **T9. Responsive 375 px y estilos de la paleta.** RF-18, RNF-4
  - Tests: Ninguno (UI).
  - Código: Ajustar el layout de `Chat.js` (área de mensajes centrada `max-w-3xl mx-auto`, composer al final, sugerencias que envuelven) usando la paleta existente, sin colores nuevos.
  - Hecho cuando: **Chrome DevTools (solo lectura)** a **375 px** — `document.documentElement.scrollWidth === window.innerWidth` (sin scroll horizontal); las tres sugerencias se ven completas; en escritorio el área está centrada con ancho máximo y la caja de entrada fija abajo. Consola sin errores.

- [ ] **T10. Verificación final: lint/build y trazabilidad RF→tests→código.** RF-1–RF-27, RNF-1–RNF-5
  - Tests: `npx vitest run src/lib/chat.test.js` (todo verde). `npm run lint` y `npm run build` (PowerShell).
  - Código: Revisar el mapeo RF→implementación/tests del plan; revisar RNF-1 (sin `fetch` en `src/lib/chat.js`; Network sin peticiones a backend/n8n salvo recursos estáticos de la app), RNF-2 (todo en español) y RNF-5 (solo lectura). Actualizar `MEMORY.md`.
  - Hecho cuando: vitest, `npm run lint` y `npm run build` pasan sin errores; los criterios 1–13 de la spec quedan verificados con **Chrome DevTools (solo lectura)** (incluida la vista de 375 px) y la spec queda lista para marcar `implementada`.
