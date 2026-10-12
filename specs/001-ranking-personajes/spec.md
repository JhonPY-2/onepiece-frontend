# specs/001-ranking-personajes/spec.md

**Estado: implementada**

## Contexto y objetivo
El backend ya expone `GET /personajes/ranking`, que devuelve como máximo 10 entradas ya ordenadas por recompensa descendente y desempatadas por nombre sin distinguir mayúsculas. La lista actual de personajes no permite ver quiénes tienen las recompensas más altas. El objetivo es ofrecer una página de ranking que muestre esos personajes con mayor recompensa.

## Usuarios
- Visitantes sin sesión iniciada.
- Usuarios con sesión iniciada.
Ambos pueden ver el ranking (no requiere autenticación).

## Historias de usuario
- Como visitante, quiero ver los personajes con mayor recompensa para conocer cuáles son los más buscados.
- Como usuario, quiero acceder al ranking desde el sidebar para encontrarlo junto al resto de secciones.

## Definiciones
- **Ranking:** lista de personajes ordenada por recompensa de mayor a menor.
- **Recompensa:** número de berries de un personaje.
- **Posición:** número entero (1, 2, 3…) calculado en el frontend según el orden recibido; no es un campo del backend.
- **Entrada del ranking:** objeto devuelto por el backend con `nombre` (texto), `recompensa` (número) y `tripulacion` (texto o `null`).
- **"Sin tripulación":** texto mostrado cuando `tripulacion` es `null`.
- **Contrato del endpoint:** `GET /personajes/ranking` devuelve como máximo 10 entradas, ya ordenadas por recompensa descendente y desempatadas por nombre sin distinguir mayúsculas. El frontend muestra lo recibido sin recortar ni reordenar.

## Requisitos funcionales (RF)
| ID | Requisito (en EARS) |
|---|--------------------|
| RF-1 | CUANDO el usuario abre la ruta `/ranking`, EL SISTEMA solicita `GET /personajes/ranking` sin parámetros. |
| RF-2 | EL SISTEMA SIEMPRE muestra el título de la página "Ranking de recompensas". |
| RF-3 | MIENTRAS la respuesta del backend está pendiente, EL SISTEMA muestra "Cargando ranking…". |
| RF-4 | CUANDO la respuesta llega con entradas, EL SISTEMA muestra todas las entradas recibidas en el mismo orden en que las devuelve el backend, sin recortarlas ni reordenarlas. |
| RF-5 | EL SISTEMA SIEMPRE muestra en cada entrada, en este orden: la posición (1, 2, 3… calculada en el frontend según el orden recibido), el nombre, la recompensa y la tripulación. |
| RF-6 | EL SISTEMA SIEMPRE formatea la recompensa con `toLocaleString()` sin locale fijo seguido de " berries", de modo que el mismo número se vea con el mismo texto en `/ranking` y en la página de detalle del personaje. |
| RF-7 | SI `tripulacion` es `null`, ENTONCES EL SISTEMA muestra "Sin tripulación". |
| RF-8 | CUANDO la respuesta llega con lista vacía, EL SISTEMA muestra "No hay personajes en el ranking". |
| RF-9 | SI la petición falla por cualquier motivo (error de red, respuesta no exitosa o cuerpo inválido), ENTONCES EL SISTEMA muestra "No se pudo cargar el ranking. Inténtalo de nuevo." y un botón "Reintentar"; CUANDO el usuario pulsa "Reintentar", EL SISTEMA vuelve a solicitar el ranking. |
| RF-10 | EL SISTEMA SIEMPRE muestra en el sidebar, con o sin sesión iniciada, una entrada "Ranking" con un icono emoji consistente con las otras secciones, enlazada a `/ranking` y con estado activo cuando la ruta es `/ranking`. |
| RF-11 | CUANDO el usuario abre `/ranking`, EL SISTEMA muestra las entradas en una sola columna con ancho máximo de 768 px; en un viewport de 375 px no hay desbordamiento horizontal (scrollWidth === innerWidth). |
| RF-12 | EL SISTEMA SIEMPRE permite ver el ranking con o sin sesión iniciada. |

## Requisitos no funcionales (RNF)
| ID | Requisito |
|---|-----------|
| RNF-1 | La página solo realiza operaciones de lectura sobre el backend. |
| RNF-2 | Todos los textos visibles están en español. |
| RNF-3 | La página usa la configuración de API existente del proyecto para consumir el backend; no define ni fija la URL del backend. |

## Casos límite
- Backend no responde o error de red → "No se pudo cargar el ranking. Inténtalo de nuevo." + botón "Reintentar".
- Respuesta no exitosa o cuerpo inválido → mismo texto de error + botón "Reintentar".
- Lista vacía → "No hay personajes en el ranking".
- `tripulacion` null → "Sin tripulación".
- Menos de 10 entradas → se muestran las disponibles, sin recortar ni reordenar.
- Vista móvil de 375 px sin scroll horizontal.
- Petición en curso → "Cargando ranking…".

## Fuera de alcance
- Selector para cambiar la cantidad de personajes (top N configurable).
- Enlace de cada entrada al detalle del personaje (requeriría el id, que el endpoint no devuelve).
- Enviar `limit` u otros parámetros al backend.
- Cualquier operación de escritura.
- Que el clic en una entrada realice una acción o navegue.

## Criterios de finalización
1. **RF-1, RF-3, RF-4, RF-5**: al abrir `/ranking` se ven "Cargando ranking…" y luego todas las entradas recibidas, en el orden del backend, con posición, nombre, recompensa y tripulación. Verificación: Chrome DevTools (solo lectura) contra el backend real, comparando orden y posición con la respuesta.
2. **RF-2**: la página muestra el título "Ranking de recompensas". Verificación: Chrome DevTools (solo lectura).
3. **RF-6**: el mismo número de recompensa se ve con el mismo texto en `/ranking` y en `/personajes/:id`. Verificación: Chrome DevTools (solo lectura), comparando ambos textos.
4. **RF-7**: una entrada con `tripulacion` null muestra "Sin tripulación". Verificación: test de Vitest del formateo con `null` o Chrome DevTools (solo lectura).
5. **RF-8**: con lista vacía se muestra "No hay personajes en el ranking". Verificación: test de Vitest del estado vacío o Chrome DevTools (solo lectura).
6. **RF-9**: cualquier fallo (red, respuesta no exitosa o cuerpo inválido) muestra "No se pudo cargar el ranking. Inténtalo de nuevo." + botón "Reintentar", y "Reintentar" relanza la petición. Verificación: test de Vitest del estado de error o Chrome DevTools (solo lectura) con el backend detenido.
7. **RF-10**: el sidebar muestra la entrada "Ranking" (emoji y estado activo en `/ranking`) con y sin sesión. Verificación: Chrome DevTools (solo lectura) en ambos estados y en 375 px/escritorio.
8. **RF-11**: en 375 px y en viewports ≥ md se ve una sola columna con ancho máximo de 768 px y sin scroll horizontal (scrollWidth === innerWidth). Verificación: Chrome DevTools (solo lectura) a 375 px.
9. **RF-12**: el ranking es visible con y sin sesión iniciada. Verificación: Chrome DevTools (solo lectura), en ambos estados.
10. **RNF-1, RNF-2**: solo operaciones de lectura y todos los textos en español. Verificación: test de Vitest/lint y Chrome DevTools (solo lectura).
11. **npm run lint y npm run build** sin errores. Verificación: comandos que ejecuta el usuario desde PowerShell.

## Nota para el plan
- Resolver cómo conviven el estado de carga ("Cargando ranking…") y el botón "Reintentar" con la convención de `AGENTS.md` (fetch en el Server Component).
