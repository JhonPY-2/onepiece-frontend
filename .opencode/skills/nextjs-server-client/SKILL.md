---
name: nextjs-server-client
description: "Úsala siempre que escribas, modifiques o revises páginas, Server Components, Client Components o buscadores/filtros en este proyecto"
---

# Server / Client Components y buscadores en onepiece-frontend

## Reglas
- El `fetch` vive en el Server Component de la página (`cache: 'no-store'` si quieres frescura). El estado y el filtrado van en un Client Component hijo que recibe los datos por props.
- Nunca pases documentos de Mongoose a un Client Component: `_id` es un `ObjectId` y las relaciones vienen pobladas. Mapea a objetos planos en el servidor (`String(_id)`, `nombre`, `imagen`, `tripulacionNombre: doc.tripulacion?.nombre ?? ''`).
- Los Client Components no pueden ser async ni importar servidor; extrae la lógica de fetch al archivo de la página.
- Los buscadores filtran de verdad: compara con `toLowerCase()` + `normalize('NFD')` quitando diacríticos (`/[\u0300-\u036f]/g`), sobre `nombre ?? ''`. Query vacía o de solo espacios → lista completa; usa `useMemo` para no recalcular en cada render.
- Estado vacío obligatorio en español ("No se encontraron personajes" + botón "Limpiar búsqueda"); nunca dejes el `<ul>` vacío a secas.
- Mantén el buscador en su fila original del encabezado; si el header debe vivir en el Client Component, muévelo completo (título + buscador + `BotonAgregar`).
- Helpers compartidos (imágenes, colores) en `src/lib/personajes.js`: no los dupliques en cada página. Preserva la transformación de Cloudinary `replace('/upload/', '/upload/f_auto,q_auto,w_400/')`.
- No inventes endpoints de búsqueda: el backend no expone ninguno y no se tocan sus contratos.

## Checklist de revisión
- [ ] El fetch quedó en el Server Component y usa `cache: 'no-store'` cuando corresponde.
- [ ] Las props del Client Component son objetos planos (sin `ObjectId`, sin docs poblados).
- [ ] El Client Component no hace fetch ni es async.
- [ ] El filtro normaliza mayúsculas y acentos y no rompe con `nombre` nulo.
- [ ] Hay estado vacío en español con forma de limpiar la búsqueda.
- [ ] El buscador conserva su lugar/estilo en el encabezado.
- [ ] No hay helpers duplicados de `src/lib/personajes.js`.
- [ ] `npm run lint` pasa sin errores.
- [ ] `npm run build` pasa (valida la serialización de props de RSC).

## Al terminar
Reporta qué checklist comprobaste y cómo:
- Serialización: build completo sin errores (si falla, casi siempre son props sin aplanar).
- Normalización/estado vacío: prueba mental con acentos, query en blanco y término inexistente.
- Ubicación: el buscador sigue en la fila del título, no sobre el grid.