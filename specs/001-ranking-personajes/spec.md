# specs/001-ranking-personajes/spec.md

**Estado: borrador**

## Contexto y objetivo
El backend ya expone `GET /personajes/ranking`, que devuelve una lista plana de personajes con `nombre`, `recompensa` y `tripulacion`. La lista actual de personajes no permite ver quiénes tienen las recompensas más altas. El objetivo es ofrecer una página de ranking que muestre los 10 personajes con mayor recompensa, ordenados de mayor a menor.

## Usuarios
- Visitantes sin sesión iniciada.
- Usuarios con sesión iniciada.
Ambos pueden ver el ranking (no requiere autenticación).

## Historias de usuario
- Como visitante, quiero ver los personajes con mayor recompensa para conocer cuáles son los más buscados.
- Como usuario, quiero acceder al ranking desde el sidebar para encontrarlo junto al resto de secciones.

## Definiciones
- **Ranking:** lista de personajes ordenada por recompensa de mayor a menor.
- **Recompensa:** valor numérico en berries de un personaje.
- **Posición:** número entero (1, 2, 3…) calculado en el frontend según el orden recibido; no es un campo del backend.
- **"Sin tripulación":** texto mostrado cuando `tripulacion` es `null`.

## Requisitos funcionales (RF)
| ID | Requisito (en EARS) |
|---|--------------------|
| RF-1 | CUANDO el usuario abre la ruta `/ranking`, EL SISTEMA solicita `GET /personajes/ranking` sin parámetros. |
| RF-2 | MIENTRAS la respuesta del backend está pendiente, EL SISTEMA muestra un indicador de carga. |
| RF-3 | CUANDO la respuesta llega con personajes, EL SISTEMA muestra hasta 10 entradas en el mismo orden en que las devuelve el backend, sin reordenarlas en el cliente. |
| RF-4 | EL SISTEMA SIEMPRE calcula la posición (1, 2, 3…) en el frontend según el orden recibido. |
| RF-5 | EL SISTEMA SIEMPRE muestra en cada entrada la posición, el nombre, la recompensa y la tripulación. |
| RF-6 | EL SISTEMA SIEMPRE formatea la recompensa con el mismo formato que usa hoy la página de detalle del personaje (número formateado seguido de " berries"). |
| RF-7 | SI `tripulacion` es `null`, ENTONCES EL SISTEMA muestra "Sin tripulación". |
| RF-8 | CUANDO el usuario hace clic en una entrada, EL SISTEMA no realiza ninguna acción (no navega). |
| RF-9 | CUANDO la respuesta llega con lista vacía, EL SISTEMA muestra "No hay personajes en el ranking". |
| RF-10 | SI la petición falla, ENTONCES EL SISTEMA muestra un mensaje de error y un botón "Reintentar"; CUANDO el usuario pulsa "Reintentar", EL SISTEMA vuelve a solicitar el ranking. |
| RF-11 | CUANDO el usuario abre el sidebar, EL SISTEMA muestra una entrada "Ranking" que enlaza a `/ranking`, junto a las demás secciones. |
| RF-12 | CUANDO el usuario abre `/ranking` en un viewport de 375 px, EL SISTEMA muestra las entradas en una sola columna, sin desbordamiento horizontal (scrollWidth === innerWidth). |
| RF-13 | EL SISTEMA SIEMPRE permite ver el ranking con o sin sesión iniciada. |

## Requisitos no funcionales (RNF)
| ID | Requisito |
|---|-----------|
| RNF-1 | La página solo realiza operaciones de lectura sobre el backend. |
| RNF-2 | Todos los textos visibles están en español. |
| RNF-3 | La interfaz se consume contra `http://localhost:3000`. |

## Casos límite
- Backend no responde o error de red → mensaje de error + botón "Reintentar".
- Lista vacía → "No hay personajes en el ranking".
- `tripulacion` null → "Sin tripulación".
- Menos de 10 personajes → se muestran los disponibles.
- Empate en recompensa → desempate por nombre sin distinguir mayúsculas (orden definido por el backend).
- Vista móvil de 375 px sin scroll horizontal.
- Petición en curso → indicador de carga.

## Fuera de alcance
- Selector para cambiar la cantidad de personajes (top N configurable).
- Enlace de cada entrada al detalle del personaje (requeriría el id, que el endpoint no devuelve).
- Enviar `limit` u otros parámetros al backend.
- Cualquier operación de escritura.

## Criterios de finalización
- La ruta `/ranking` es accesible desde una entrada "Ranking" en el sidebar.
- Muestra hasta 10 entradas en el orden del backend, con posición calculada, recompensa formateada y "Sin tripulación" cuando aplica.
- Estados de carga, vacío y error+reintentar verificados.
- En 375 px no hay desbordamiento horizontal.
- Verificado con `npm run lint`, `npm run build` y Chrome DevTools (solo lectura).

## Dudas abiertas
- Ninguna. Campos del endpoint confirmados por el usuario: `nombre`, `recompensa`, `tripulacion`.
