---
description: Validar spec requisito por requisito (sin modificar nada)
agent: plan
---

Use the skill: sdd

Recorre `specs/$1/spec.md` **requisito por requisito** (RF-01, RF-02, ...).

Para cada RF:
1. **Si es requisito de lógica**: indica qué test de **Vitest** lo cubre (archivo y nombre exacto del test) y si el criterio queda **realmente verificado** o si el test es **débil** (ejemplos: usa `<=` cuando pide número exacto, verifica solo estructura genérica, no cubre caso límite, etc.).
2. **Si es requisito de interfaz**: indica cómo se verifica con **Chrome DevTools** (solo lectura): qué se ve, en qué viewport (incluye la **móvil de 375 px**), qué pasa al hacer clic, y qué comandos exactos debe correr el usuario desde PowerShell (`npx vitest run <archivo>`, `npm run lint`, `npm run build`). Comprueba también los **casos límite** de **carga/error cuando el backend** (`http://localhost:3000`) **no responde**.
3. Si algún RF **no está cubierto** o la verificación es **débil**, dilo **claramente**. **NO arregles nada**.

Al final:
- Comprueba los **criterios de finalización** de la spec.
- Da un **veredicto** claro: ¿la spec está cumplida? (Sí/No + justificación breve).

Notas: NO ejecutes tests, lint ni build (solo lectura de spec, plan, tasks y tests existentes). El agente NO arranca servidores. Si usas Chrome DevTools en `http://localhost:3001`, hazlo **solo con acciones de LECTURA** y si el servidor o el backend no responden, PARA y avisa.

$ARGUMENTS