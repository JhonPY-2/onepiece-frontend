# specs/002-chat-ia/plan.md

## 1. Archivos a crear/modificar y responsabilidades

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/lib/chat.js` | Crear | Lógica pura y **único punto reemplazable** de la respuesta (RF-17). Sin JSX, sin React, sin estado: `esMensajeVacio`, `RESPUESTA_DEMO`, `ESPERA_MS`, `crearMensaje`, `enviarMensajeChat`. |
| `src/app/chat/page.js` | Crear | Server Component delgado de `/chat`: solo `<main>` y render de `<Chat />`. Sin estado ni fetch. |
| `src/app/chat/Chat.js` | Crear | Client Component orquestador (`'use client'`): estado `mensajes`/`texto`/`escribiendo`, guard síncrono `enviandoRef`, handlers de envío y teclado, foco inicial, auto-scroll y estado vacío (saludo + sugerencias). Llama a `src/lib/chat.js`. |
| `src/components/ListaMensajes.js` | Crear | Presentación: burbujas de usuario/asistente en lados y colores distintos, texto literal, y el indicador "escribiendo…". Recibe props (`mensajes`, `escribiendo`, `refFin`). Sin estado propio. |
| `src/components/CajaMensaje.js` | Crear | Presentación del composer: `textarea` multilínea (máx. 6 líneas con scroll interno) + botón enviar visible. Recibe `valor`, `onCambio`, `onEnviar`, `onTecla`, `deshabilitado`, `refCaja`. |
| `src/components/Sidebar.js` | Modificar | Añadir entrada "💬 Chat" enlazada a `/chat` con estado activo (`chatActivo`), en el `<nav>` superior (visible con y sin sesión). |
| `src/lib/chat.test.js` | Crear | Tests de Vitest de la lógica pura de `src/lib/chat.js`. |
| `package.json` / `vitest.config.mjs` | No tocar | Ya configurados en la Spec 001 (Vitest + Testing Library + jsdom). |

**Detalle de `src/lib/chat.js`**
- `RESPUESTA_DEMO` = `"(Respuesta de demostración) El Rey de los Piratas, Gol D. Roger, dejó su tesoro, el One Piece, y quien lo encuentre heredará su título."` (texto exacto de RF-7).
- `ESPERA_MS = 2000` (dentro del rango 1,5–3 s de RF-22).
- `esMensajeVacio(texto)` → `String(texto ?? '').trim().length === 0` (cubre vacío, espacios, tabs y saltos, RF-9).
- `crearMensaje(texto, autor, id)` → `{ id, autor, texto }` con `autor` en `'usuario' | 'asistente'`.
- `enviarMensajeChat(mensaje)` → **único punto reemplazable (RF-17)**: espera `ESPERA_MS` y devuelve `RESPUESTA_DEMO` (RF-6, RF-7, RF-8). Mañana se sustituye su cuerpo por la llamada a n8n sin tocar componentes.

**Detalle de `src/app/chat/Chat.js`**
- Layout `flex flex-col` con altura `h-[calc(100dvh-4rem)] md:h-screen` (descuenta el `pt-16` que `AppShell` añade en móvil), área de mensajes `flex-1 overflow-y-auto` con contenedor `max-w-3xl mx-auto`, composer al final (RNF-4).
- `<h1>Chat de One Piece` (RF-1).
- Estado vacío (`mensajes.length === 0 && !escribiendo`): saludo y tres botones de sugerencia (RF-2, RF-3); al pulsar, llaman a `enviar(textoSugerencia)` (RF-4).
- `enviandoRef` (`useRef(false)`) como guard síncrono contra el doble envío rápido (RF-11).
- `enviar(valor)`: sale si `enviandoRef.current` o `escribiendo` (RF-11) o si `esMensajeVacio(valor)` (RF-9); marca `enviandoRef.current = true` de inmediato; añade burbuja de usuario (RF-5); vacía el texto (RF-10); `setEscribiendo(true)` (RF-6); `await enviarMensajeChat(valor)` dentro de `try/finally`; añade burbuja de asistente (RF-7); el `finally` libera `enviandoRef.current = false` y `setEscribiendo(false)` **siempre**, aunque falle la respuesta (así el chat no se bloquea cuando se conecte n8n).
- `onKeyDown`: `Enter` sin `Shift` → `preventDefault()` + `enviar` (RF-21); `Shift+Enter` no se previene → salto de línea (RF-24).
- `useEffect` de montaje → `refCaja.current.focus()` (RF-26).
- `useEffect([mensajes, escribiendo])` → `refFin.current.scrollIntoView({ block: 'end' })` (RF-12).

**Detalle de `src/components/ListaMensajes.js`**
- Por cada mensaje: contenedor `flex` con `justify-end` (usuario) o `justify-start` (asistente); burbuja `bg-gold text-white` (usuario) vs `bg-white/10 text-white` (asistente), `rounded-2xl` (RF-13).
- Texto con `{m.texto}` — React lo escapa por defecto, sin `dangerouslySetInnerHTML` (RF-27).
- Si `escribiendo`, muestra un bloque en el lado del asistente con `escribiendo…` (RF-6).
- `<div ref={refFin} />` al final (RF-12).

**Detalle de `src/components/CajaMensaje.js`**
- `textarea` con `rows={1}`, `leading-6`, `resize-none`, `field-sizing-content`, `max-h-[10.5rem]` (6 líneas = 9 rem + padding `py-3` = 1,5 rem) y `overflow-y-auto` (RF-20, RF-23).
- Botón de enviar visible con `disabled={deshabilitado}` y estilos de la paleta (`bg-gold`) (RF-11, RF-14).

## 2. Lógica (pseudocódigo)

```
// src/lib/chat.js  (puro: sin JSX, sin React)
export RESPUESTA_DEMO = "(Respuesta de demostración) El Rey de los Piratas, Gol D. Roger, " +
                        "dejó su tesoro, el One Piece, y quien lo encuentre heredará su título."
export ESPERA_MS = 2000                                   // 1500 <= ESPERA_MS <= 3000  (RF-22)

esMensajeVacio(texto):
    return String(texto ?? '').trim().length === 0        // espacios/tabs/saltos cuentan (RF-9)

crearMensaje(texto, autor, id):
    return { id, autor, texto }                           // autor: 'usuario' | 'asistente'

enviarMensajeChat(mensaje):                               // ÚNICO punto reemplazable (RF-17)
    await esperar(ESPERA_MS)                              // RF-6, RF-22
    return RESPUESTA_DEMO                                 // mismo texto siempre (RF-7, RF-8)

// src/app/chat/Chat.js  ('use client')
Chat():
    mensajes, setMensajes ← useState([])
    texto, setTexto       ← useState('')
    escribiendo, setEscribiendo ← useState(false)
    enviandoRef           ← useRef(false)                 // guard síncrono (RF-11)
    refCaja, refFin       ← useRef()

    useEffect( [], ): refCaja.current.focus()             // RF-26
    useEffect( [mensajes, escribiendo], ):
        refFin.current.scrollIntoView({ block: 'end' })   // RF-12

    enviar(valor):
        SI enviandoRef.current O escribiendo: return      // guard síncrono + estado (RF-11)
        SI esMensajeVacio(valor): return                  // RF-9
        enviandoRef.current = true                        // bloquea al instante (RF-11)
        setMensajes(actuales => [...actuales, crearMensaje(valor, 'usuario', nuevoId())])  // RF-5
        setTexto('')                                      // RF-10
        setEscribiendo(true)                              // RF-6
        try:
            respuesta ← await enviarMensajeChat(valor)
            setMensajes(actuales => [...actuales, crearMensaje(respuesta, 'asistente', nuevoId())])  // RF-7
        finally:
            enviandoRef.current = false                   // se libera aunque falle
            setEscribiendo(false)                         // el chat nunca queda bloqueado

    onTecla(e):
        SI e.key === 'Enter' Y NO e.shiftKey:
            e.preventDefault(); enviar(texto)             // RF-21 (Shift+Enter NO llega aquí) RF-24

    return:
        <main className="flex flex-col h-[calc(100dvh-4rem)] md:h-screen bg-navy p-4 sm:p-8">
            <h1>Chat de One Piece</h1>                    // RF-1
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                SI mensajes.length === 0 Y NO escribiendo:  // estado vacío
                    <p>¡Hola! Soy tu asistente de One Piece. ¿Sobre qué quieres preguntar?</p>   // RF-2
                    botón "¿Quién es Monkey D. Luffy?"    onClick = enviar(texto)   // RF-3, RF-4
                    botón "¿Qué es la Fruta del Diablo?"  onClick = enviar(texto)   // RF-3, RF-4
                    botón "¿Cuántos arcos tiene One Piece?" onClick = enviar(texto) // RF-3, RF-4
                SI NO:
                    <ListaMensajes mensajes escribiendo refFin />   // RF-5,6,7,13,27
              </div>
            </div>
            <CajaMensaje valor=texto onCambio=setTexto onEnviar=enviar onTecla=onTecla
                         deshabilitado=escribiendo refCaja />        // RF-14,20,23
        </main>

// src/components/ListaMensajes.js  (presentación, sin 'use client')
ListaMensajes({ mensajes, escribiendo, refFin }):
    PARA m EN mensajes:
        <div className={ m.autor==='usuario' ? 'justify-end' : 'justify-start' }>   // RF-13
            <div className={ m.autor==='usuario' ? 'bg-gold text-white' : 'bg-white/10 text-white' }>
                {m.texto}                            // literal, React escapa (RF-27)
    SI escribiendo:
        <div className="justify-start"><div className="bg-white/10">escribiendo…</div></div>  // RF-6
    <div ref={refFin} />                             // RF-12

// src/components/CajaMensaje.js  (presentación, sin 'use client')
CajaMensaje({ valor, onCambio, onEnviar, onTecla, deshabilitado, refCaja }):
    <textarea ref={refCaja} rows={1} value={valor}
              onChange={e => onCambio(e.target.value)} onKeyDown={onTecla}
              className="... leading-6 resize-none field-sizing-content max-h-[10.5rem] overflow-y-auto" />  // RF-20,23
    <button onClick={() => onEnviar(valor)} disabled={deshabilitado}>Enviar</button>   // RF-11,14

// src/components/Sidebar.js  (modificar)
chatActivo = pathname?.startsWith('/chat') ?? false
<Link href="/chat" className={ chatActivo ? 'bg-gold/15' : 'bg-transparent' }>💬 Chat</Link>   // RF-15, RF-19
```

## 3. Decisiones técnicas justificadas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| `Chat.js` como Client Component con estado local (`useState`), `page.js` Server Component delgado | El historial debe ser efímero (RF-16, RF-25, RNF-3): al desmontar la página en la navegación cliente o al recargar, el estado local se pierde. Mantiene la convención del proyecto (página server + componente cliente hijo). | Guardar el historial en un store global o contexto (sobrevive a la navegación → rompe RF-16/25), o todo dentro de `page.js` como cliente (rompe la convención). |
| `enviarMensajeChat(mensaje)` en `src/lib/chat.js` como único punto reemplazable | RF-17: la respuesta sale de una sola función; para conectar n8n se cambia solo su cuerpo (un `fetch`), sin tocar componentes. | `fetch`/`setTimeout` inline en `Chat.js`: punto de conexión difuso y no testeable. |
| Retardo `ESPERA_MS = 2000` dentro de la capa de lógica | RF-22 se cumple con un valor único y verificable por test (`1500 <= ESPERA_MS <= 3000`); reproduce la espera del futuro backend. | `setTimeout` en el componente: temporización dispersa y no testeable sin DOM. |
| Guard síncrono `enviandoRef` (`useRef`) además del estado `escribiendo` | El estado `escribiendo` no se actualiza hasta el siguiente render, así que dos envíos en el mismo tick (doble Enter o clic rápido) verían `escribiendo === false` y colarían un segundo mensaje. El `useRef` cambia su valor de inmediato y bloquea el segundo envío (RF-11). | Confiar solo en el estado `escribiendo` o en un `useState`: ambos son asíncronos y permiten el doble envío que RF-11 prohíbe. |
| `try/finally` alrededor de `enviarMensajeChat`, liberando en `finally` | Garantiza que `enviandoRef.current = false` y `setEscribiendo(false)` se ejecuten siempre, incluso si la respuesta falla; el chat nunca se queda bloqueado en "escribiendo…" cuando se conecte n8n (RF-11, RF-6). | Liberar solo en el camino feliz: si `enviarMensajeChat` lanza, el chat quedaría bloqueado en "escribiendo…" para siempre. |
| `textarea` con `field-sizing-content` + `max-h-[10.5rem]` (6 líneas) + `overflow-y-auto` | RF-20 y RF-23 (máx. 6 líneas y scroll interno al superarlas) con CSS puro, sin JS ni mediciones. Tailwind v4 expone `field-sizing-content`; verificación en Chrome. | Auto-resize con `ref` + `scrollHeight` en un `useEffect` (más código, estado de altura y `reflow` en cada tecla). |
| Render del texto con `{m.texto}` (React escapa por defecto) | RF-27: el contenido se muestra literal; sin interpretar HTML ni caracteres especiales. | `dangerouslySetInnerHTML`: interpretaría HTML y abriría XSS (prohibido). |
| Burbujas: usuario `bg-gold`, asistente `bg-white/10`, con `justify-end`/`justify-start` | RF-13 con la paleta existente (RNF-4, sin colores nuevos). | Usar las variables `--color-*` nuevas o gradientes innecesarios. |
| Entrada "💬 Chat" en el `<nav>` superior del sidebar | RF-15/RF-19: ese `<nav>` se muestra con y sin sesión, así que el chat queda visible en ambos estados. | Colocarla en el `<nav>` de autenticación: no se vería sin sesión (rompe RF-19). |
| Sin tests unitarios de componentes; solo lógica pura en `src/lib/chat.js` | Lo indica el encargo y la constitución (principio 4): la interfaz se verifica con lint/build/DevTools, no con unit tests. | Tests de `CajaMensaje`/`ListaMensajes` con Testing Library: frágiles y solapan con la verificación visual. |
| No reinstalar dependencias de test | Vitest + Testing Library + `vitest.config.mjs` ya existen (Spec 001); reinstalar duplicaría configuración. | Repetir la tarea de instalación de la skill (aplica solo a la primera spec). |

## 4. Estrategia de tests y verificación

**Lógica — Vitest (dependencias y `vitest.config.mjs` ya listos desde la Spec 001).**
Archivo `src/lib/chat.test.js`.
Comandos que **ejecuta el usuario** desde PowerShell:
`npx vitest run src/lib/chat.test.js`, `npm run test:run`.

| Test | Cubre | Comportamiento esperado |
|---|---|---|
| `esMensajeVacio('')` | RF-9 | `true`. |
| `esMensajeVacio('   ')` | RF-9 | `true` (solo espacios). |
| `esMensajeVacio(' \n\t ')` | RF-9 | `true` (solo saltos/tabs). |
| `esMensajeVacio(null)` / `undefined` | RF-9 | `true` (robustez). |
| `esMensajeVacio('hola')` | RF-9 | `false`. |
| `esMensajeVacio('  hola ')` | RF-9 | `false` (con espacios alrededor sigue siendo válido). |
| `RESPUESTA_DEMO` | RF-7 | Empieza por `"(Respuesta de demostración)"` y coincide con el texto fijo exacto de la spec. |
| `enviarMensajeChat('x')` (fake timers) | RF-7, RF-17 | Resuelve `RESPUESTA_DEMO`. |
| `enviarMensajeChat` con dos mensajes distintos | RF-8 | Ambos resuelven el mismo `RESPUESTA_DEMO`. |
| `ESPERA_MS` | RF-22 | `>= 1500` y `<= 3000`. |
| `crearMensaje(texto, autor, id)` | RF-5, RF-13 | Devuelve `{ id, autor, texto }`. |

**Interfaz — NO unit tests.** Se verifica con:
- `npm run lint` y `npm run build` (los ejecuta el usuario en PowerShell).
- MCP Chrome DevTools (**solo lectura**) contra `http://localhost:3001`:
  - RF-1/RF-2/RF-3/RF-26: abrir `/chat`; ver título "Chat de One Piece", saludo y las tres sugerencias exactas; foco en el textarea.
  - RF-4/RF-5/RF-9/RF-10/RF-21/RF-24: pulsar sugerencia y enviar por Enter → burbuja de usuario y caja vacía; `Shift+Enter` añade línea sin enviar; caja vacía/solo espacios no envía nada.
  - RF-6/RF-7/RF-8/RF-12/RF-22: al enviar aparece "escribiendo…" y cronometrar (1,5–3 s) hasta la respuesta fija de demostración; el último elemento queda visible.
  - RF-11: durante "escribiendo…" el botón está `disabled` y Enter/click repetidos no duplican (el guard `enviandoRef` frena el doble envío en el mismo tick).
  - RF-13/RF-14/RF-18/RF-20/RF-23: burbujas con lados y colores distintos, caja multilínea con botón; escribir 7+ líneas → scroll interno y la caja no crece; a 375 px `document.documentElement.scrollWidth === window.innerWidth`.
  - RF-15/RF-19: entrada "💬 Chat" visible y activa en `/chat`, con y sin sesión.
  - RF-16/RF-25: recargar y salir/volver por navegación cliente → estado vacío.
  - RF-27: enviar `<b>hola</b>` y `&` → se ven como texto literal.
  - RNF-1/RNF-3/RNF-5: revisar Network/Storage (sin peticiones a backend ni n8n, sin persistencia) y revisión de código.
- Regla de seguridad: solo lectura; el backend del puerto 3000 puede apuntar a la base real.

## 5. Mapeo RF → implementación/tests

| RF | Implementación | Verificación |
|---|---|---|
| RF-1 | `<h1>Chat de One Piece` en `Chat.js` | DevTools |
| RF-2 | Saludo en el estado vacío de `Chat.js` | DevTools |
| RF-3 | Tres botones de sugerencia en `Chat.js` | DevTools (textos exactos) |
| RF-4 | `onClick` de cada sugerencia → `enviar(texto)` | DevTools |
| RF-5 | `enviar` añade `crearMensaje(valor,'usuario',id)` + `ListaMensajes` | Test `crearMensaje` + DevTools |
| RF-6 | `setEscribiendo(true)` + indicador en `ListaMensajes` | DevTools |
| RF-7 | `RESPUESTA_DEMO` + `enviarMensajeChat` + burbuja asistente | Test `RESPUESTA_DEMO` + DevTools |
| RF-8 | `enviarMensajeChat` devuelve siempre `RESPUESTA_DEMO` | Test (dos entradas → mismo texto) |
| RF-9 | `esMensajeVacio` + guard en `enviar` | Tests de `esMensajeVacio` + DevTools |
| RF-10 | `setTexto('')` en `enviar` | DevTools |
| RF-11 | Guard `enviandoRef` + `escribiendo` en `enviar` + `disabled` en `CajaMensaje` | DevTools (doble Enter/clic) |
| RF-12 | `scrollIntoView` en `useEffect` + `refFin` | DevTools |
| RF-13 | Clases de alineación y color por `autor` en `ListaMensajes` | DevTools |
| RF-14 | `CajaMensaje` con botón "Enviar" visible | DevTools |
| RF-15 | Link "💬 Chat" en `Sidebar.js` con `chatActivo` | DevTools (emoji + activo) |
| RF-16 | Estado local efímero (montaje) | DevTools (recarga) |
| RF-17 | `enviarMensajeChat` en `src/lib/chat.js` | Revisión de código + plan |
| RF-18 | Layout `max-w-3xl mx-auto`, sugerencias `flex-wrap` | DevTools 375 px (`scrollWidth === innerWidth`) |
| RF-19 | Link en `<nav>` superior (independiente de auth) | DevTools con y sin sesión |
| RF-20 | `textarea leading-6 max-h-[10.5rem]` | DevTools |
| RF-21 | `onKeyDown` Enter → `preventDefault` + `enviar` | DevTools |
| RF-22 | `ESPERA_MS = 2000` en `src/lib/chat.js` | Test de rango + DevTools (cronómetro) |
| RF-23 | `field-sizing-content` + `max-h` + `overflow-y-auto` | DevTools (7+ líneas) |
| RF-24 | `Shift+Enter` sin `preventDefault` | DevTools |
| RF-25 | Desmontaje por navegación cliente | DevTools (ir y volver) |
| RF-26 | `focus()` en `useEffect` de montaje | DevTools |
| RF-27 | `{m.texto}` (React escapa) | DevTools (`<b>hola</b>`, `&`) |
| RNF-1 | `enviarMensajeChat` sin `fetch` | Revisión de código + Network |
| RNF-2 | Textos en español | Revisión + DevTools |
| RNF-3 | Sin `localStorage`/cookies/servidor | Revisión de código |
| RNF-4 | Paleta, `rounded-2xl`, `max-w-3xl`, composer al final | DevTools escritorio y 375 px |
| RNF-5 | Solo lectura | Revisión de código |
