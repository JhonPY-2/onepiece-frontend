# specs/002-chat-ia/spec.md

**Estado: aprobada**

## Contexto y objetivo
El proyecto no tiene forma de conversar con un asistente sobre One Piece. Se necesita una sección de chat que hoy sirva como maqueta de interfaz con apariencia moderna tipo ChatGPT; no habla con ningún backend ni con n8n: las respuestas son un texto fijo de demostración. El objetivo es dejar lista y verificable la experiencia (estado vacío, mensajes, envío, indicador de "escribiendo…") con un único punto identificable donde más adelante se conecte n8n. El historial vive solo en memoria de la página y no se guarda.

## Usuarios
- Visitantes sin sesión iniciada.
- Usuarios con sesión iniciada.
Ambos ven y usan la página (no requiere autenticación).

## Historias de usuario
- Como visitante, quiero abrir un chat sobre One Piece para ver cómo será la experiencia antes de que exista la integración real.
- Como usuario, quiero encontrar el chat 💬 en el sidebar junto al resto de secciones para acceder fácilmente.
- Como responsable técnico, quiero un único punto claro donde conectar n8n después, para no tener que rebuscar en el código.

## Definiciones
- **Mensaje de usuario:** burbuja alineada a un lado con el texto que escribió el usuario.
- **Mensaje de asistente:** burbuja alineada al lado opuesto con la respuesta.
- **Estado vacío:** vista inicial cuando aún no hay ningún mensaje.
- **Respuesta de demostración:** texto fijo, igual para cualquier mensaje, marcado explícitamente como "(Respuesta de demostración)".
- **Indicador "escribiendo…":** señal temporal mostrada mientras se prepara la respuesta.
- **Caja de texto:** campo multilínea donde el usuario escribe; Enter envía y Shift+Enter inserta un salto de línea.
- **Historial:** lista de mensajes de la sesión; solo en memoria, se pierde al recargar o al salir de `/chat` y volver.

## Requisitos funcionales (RF)
| ID | Requisito (en EARS) |
|---|--------------------|
| RF-1 | CUANDO el usuario abre `/chat`, EL SISTEMA muestra la página con el título "Chat de One Piece" y el estado vacío. |
| RF-2 | MIENTRAS no hay ningún mensaje, EL SISTEMA muestra el saludo "¡Hola! Soy tu asistente de One Piece. ¿Sobre qué quieres preguntar?". |
| RF-3 | MIENTRAS no hay ningún mensaje, EL SISTEMA muestra tres botones de sugerencia con los textos exactos "¿Quién es Monkey D. Luffy?", "¿Qué es la Fruta del Diablo?" y "¿Cuántos arcos tiene One Piece?". |
| RF-4 | CUANDO el usuario pulsa una sugerencia, EL SISTEMA envía ese texto como mensaje de usuario y deja de mostrar el estado vacío. |
| RF-5 | CUANDO el usuario envía un mensaje (Enter o botón enviar), EL SISTEMA añade al final de la lista una burbuja de usuario con ese texto. |
| RF-6 | MIENTRAS se prepara la respuesta, EL SISTEMA muestra el indicador "escribiendo…" en el lado del asistente. |
| RF-7 | CUANDO termina la espera, EL SISTEMA sustituye el indicador por una burbuja de asistente con el texto fijo "(Respuesta de demostración) El Rey de los Piratas, Gol D. Roger, dejó su tesoro, el One Piece, y quien lo encuentre heredará su título.". |
| RF-8 | EL SISTEMA SIEMPRE responde con ese mismo texto fijo, sea cual sea el mensaje enviado. |
| RF-9 | SI la caja de texto está vacía o contiene solo espacios y/o saltos de línea, ENTONCES EL SISTEMA considera el mensaje vacío y no lo envía ni añade burbujas. |
| RF-10 | CUANDO el usuario envía un mensaje, EL SISTEMA vacía la caja de texto. |
| RF-11 | MIENTRAS el indicador "escribiendo…" está visible, EL SISTEMA muestra el botón de enviar deshabilitado y la tecla Enter no envía. |
| RF-12 | CUANDO se añade un mensaje o aparece el indicador "escribiendo…", EL SISTEMA desplaza el área de mensajes para que el último elemento quede visible. |
| RF-13 | EL SISTEMA SIEMPRE muestra la burbuja de usuario y la de asistente alineadas en lados opuestos y con colores de fondo distintos entre sí. |
| RF-14 | EL SISTEMA SIEMPRE muestra la caja de texto con un botón de enviar visible. |
| RF-15 | EL SISTEMA SIEMPRE muestra en el sidebar la entrada "Chat" con el emoji 💬, visible con o sin sesión, enlazada a `/chat` y con estado activo cuando la ruta es `/chat`. |
| RF-16 | CUANDO se recarga `/chat`, EL SISTEMA descarta el historial y vuelve a mostrar el estado vacío. |
| RF-17 | EL SISTEMA SIEMPRE obtiene la respuesta del asistente desde un único punto reemplazable por la integración real; su implementación concreta se define en el plan. |
| RF-18 | CUANDO el usuario abre `/chat` en un viewport de 375 px, EL SISTEMA muestra la página completa sin desbordamiento horizontal (scrollWidth === innerWidth). |
| RF-19 | EL SISTEMA SIEMPRE hace visible la sección de chat tanto con como sin sesión iniciada. |
| RF-20 | EL SISTEMA SIEMPRE muestra la caja de texto como campo multilínea con una altura máxima de 6 líneas. |
| RF-21 | CUANDO el usuario pulsa Enter en la caja de texto, EL SISTEMA envía el mensaje y no inserta un salto de línea. |
| RF-22 | CUANDO el usuario envía un mensaje, EL SISTEMA mantiene visible el indicador "escribiendo…" entre 1,5 y 3 segundos antes de mostrar la respuesta de demostración. |
| RF-23 | CUANDO el texto supera las 6 líneas, EL SISTEMA activa scroll interno dentro de la caja sin agrandarla más. |
| RF-24 | CUANDO el usuario pulsa Shift+Enter en la caja de texto, EL SISTEMA inserta un salto de línea y no envía el mensaje. |
| RF-25 | CUANDO el usuario sale de `/chat` y vuelve mediante navegación del lado del cliente, EL SISTEMA descarta el historial y muestra el estado vacío. |
| RF-26 | CUANDO el usuario abre `/chat`, EL SISTEMA coloca el foco en la caja de texto. |
| RF-27 | EL SISTEMA SIEMPRE muestra el contenido de los mensajes como texto literal, sin interpretar HTML ni caracteres especiales. |

## Requisitos no funcionales (RNF)
| ID | Requisito |
|---|-----------|
| RNF-1 | La página no realiza peticiones al backend ni a n8n (las fuentes y recursos estáticos propios de la app no cuentan): toda la conversación es local y de demostración. |
| RNF-2 | Todos los textos visibles están en español. |
| RNF-3 | El historial no se persiste en ningún medio (ni almacenamiento del navegador ni servidor). |
| RNF-4 | La interfaz usa la paleta y los estilos existentes del proyecto: burbujas con esquinas redondeadas, área de mensajes centrada con ancho máximo y caja de entrada fija en la parte inferior. |
| RNF-5 | Solo operaciones de lectura: la página no modifica datos. |

## Casos límite
- Envío con la caja vacía, con solo espacios o con solo saltos de línea → se considera vacío y no ocurre nada.
- Recarga o reentrada a `/chat` (navegación del lado del cliente) → historial descartado, estado vacío.
- Escribir varias líneas con Shift+Enter hasta superar las 6 líneas → aparece scroll interno en la caja y la caja no crece más.
- Un mensaje muy largo (texto extenso) → la burbuja ajusta el texto sin desbordar; en 375 px no hay scroll horizontal.
- Muchos mensajes seguidos → el área de mensajes hace scroll y el último elemento queda visible.
- Contenido con caracteres especiales o etiquetas HTML (`<b>`, `<script>`, `&`, etc.) → se muestra como texto literal, sin interpretarse.
- En 375 px las tres sugerencias se ven completas y sin desbordamiento horizontal.
- Al abrir `/chat` el foco está en la caja de texto.
- Pulsar enviar o Enter repetidamente durante "escribiendo…" → botón deshabilitado y Enter ignorado; no se añaden mensajes ni respuestas duplicadas.
- Uso con teclado virtual móvil → la caja y el scroll interno funcionan sin desbordamiento horizontal.
- Vista móvil de 375 px → sin desbordamiento horizontal (scrollWidth === innerWidth).

## Fuera de alcance
- Llamada real a n8n o a cualquier backend (solo el punto de conexión marcado).
- Respuestas con formato enriquecido, streaming o markdown.
- Persistencia del historial (localStorage, cookies, servidor).
- Varias conversaciones o historial entre sesiones.
- Adjuntar archivos, editar o borrar mensajes.
- Autenticación obligatoria para usar el chat.
- Contexto real sobre One Piece en las respuestas (son fijas de demostración).

## Criterios de finalización
1. **RF-1, RF-2, RF-3, RF-26**: al abrir `/chat` sin mensajes se ve el título "Chat de One Piece", el saludo y las tres sugerencias exactas, y el foco está en la caja de texto. Verificación: Chrome DevTools (solo lectura).
2. **RF-4, RF-5, RF-10, RF-21, RF-24**: pulsar una sugerencia o escribir y enviar (Enter) añade la burbuja del usuario y vacía la caja; Shift+Enter inserta salto de línea sin enviar. Verificación: Chrome DevTools (solo lectura).
3. **RF-6, RF-7, RF-8, RF-12, RF-22**: tras enviar se ve "escribiendo…" entre 1,5 y 3 segundos y luego la respuesta fija marcada como demostración, con el último elemento visible. Verificación: Chrome DevTools (solo lectura).
4. **RF-9, RF-11**: caja vacía/solo espacios o saltos no envía; durante "escribiendo…" el botón está deshabilitado y Enter no duplica. Verificación: Chrome DevTools (solo lectura).
5. **RF-13, RF-14, RF-18, RF-19, RF-20, RF-23**: burbujas con lados y colores distintos, caja multilínea con botón, altura máxima de 6 líneas con scroll interno, 375 px sin scroll horizontal y visible con y sin sesión. Verificación: Chrome DevTools (solo lectura) a 375 px y escritorio, en ambos estados.
6. **RF-15**: el sidebar muestra "Chat" (💬 y estado activo en `/chat`) siempre. Verificación: Chrome DevTools (solo lectura).
7. **RF-16, RF-25**: recargar o reentrar en `/chat` deja el estado vacío. Verificación: Chrome DevTools (solo lectura).
8. **RF-17**: existe un único punto reemplazable que produce la respuesta, sin detalle de implementación en la spec. Verificación: revisión del código y del plan.
9. **RF-27**: el contenido con caracteres especiales o HTML se muestra como texto literal. Verificación: Chrome DevTools (solo lectura), enviando texto como `<b>hola</b>` o `&`.
10. **RNF-1, RNF-2, RNF-3, RNF-5**: sin peticiones a backend ni n8n (los recursos estáticos de la app no cuentan), todo en español, sin persistencia y sin escritura. Verificación: consola/red de Chrome DevTools (solo lectura) y revisión de código.
11. **RNF-4**: paleta existente, burbujas redondeadas, área de mensajes centrada con ancho máximo y caja de entrada fija abajo. Verificación: Chrome DevTools (solo lectura) en escritorio y 375 px.
12. **Lógica pura** (validación de mensaje vacío y origen de la respuesta de demostración) cubierta con Vitest. Verificación: `npx vitest run` (el usuario lo ejecuta desde PowerShell).
13. **npm run lint y npm run build** sin errores. Verificación: comandos que ejecuta el usuario desde PowerShell.

## Dudas abiertas
- Ninguna.
