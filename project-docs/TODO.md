# Estado de PlayNexo

## ARCADE — conservar y facilitar ampliaciones

- [x] Conservar Neon Snake, Micro Pong y Pixel Dash; no eliminar funciones existentes. Los tres continúan implementados en JavaScript/Canvas.
- [x] Mantener búsqueda por nombre, filtros por categoría y los controles de teclado y táctiles existentes.
- [x] Registrar cada juego con metadatos, indicaciones, controles táctiles y callbacks de creación de estado, actualización y renderizado; mantener separados los módulos de comportamiento sin cambiar las mecánicas actuales.
- [x] Mantener la identidad visual existente; la tarjeta y el selector de juegos siguen dentro de la cuadrícula original.

## EMULACIÓN RETRO — integración comprobable

- [x] Crear una página retro separada, enlazada desde la sección Emulación y con estado “integrado · prueba” solo para NES/Famicom.
- [x] Comparar alternativas: EmulatorJS v4.2.3 no se incorpora por su distribución completa de 303,554,683 bytes y la revisión de licencias que exige una integración multi-sistema; JSNES 3.0.0 se elige para el piloto bajo Apache-2.0.
- [x] Integrar código fuente ESM de JSNES en el repositorio con la licencia y metadatos de versión; no cargar el emulador desde CDN ni añadir ROMs, BIOS o paquetes de juegos.
- [x] Aceptar únicamente archivos `.nes` con cabecera iNES y de hasta 16 MiB; indicar que la persona debe tener derecho a utilizar el archivo.
- [x] Mostrar controles NES de teclado y táctiles, requisitos de formato/tamaño y estado real del sistema.
- [x] No afirmar que PS3/PS4/PS5, Nintendo Switch o Xbox se ejecutan en esta página; las filas restantes son orientación informativa.
- [x] No subir el archivo privado ni persistirlo deliberadamente; leerlo con `File.arrayBuffer()` en memoria local y ofrecer control para cerrar/liberar referencias.

## CONTROL DEL PROYECTO

- [x] Mantener todos los cambios, el código de JSNES y sus avisos en el repositorio GitHub `said23-hacking/hacking23`; no depender de servicios de Manus.
- [x] Mantener arquitectura HTML/CSS/JS sin framework, backend ni CDN, compatible con GitHub Pages estático desde `main/docs`.
- [x] Documentar diseño, límites, licencias, investigación y mantenimiento en `project-docs/`.
- [x] Subir únicamente la rama de trabajo `feat/playnexo-retro-foundation` tras las pruebas; mantener `main` y GitHub Pages intactos.

## RESPONSIVE Y SEGURIDAD

- [x] Probar la página NES a 390 px en Chromium con un cartucho sintético no comercial generado fuera del repositorio; el núcleo carga y ejecuta la ROM en Canvas.
- [x] Revisar el tráfico del player: no hubo solicitudes externas ni métodos de subida; la portada carga las fuentes Google que ya usaba el sitio y nunca recibe el archivo local.
- [x] Rechazar el archivo malformado con un mensaje de error y descargar el cartucho de prueba, liberando referencias de memoria.
- [x] Probar en navegador la cuadrícula original, búsqueda, filtro, apertura, controles visibles, inicio y cierre de Neon Snake, Micro Pong y Pixel Dash; sin errores de JavaScript.
- [x] Comprobar enlaces locales, favicon, respuesta HTTP y desbordamiento horizontal en 390, 768 y 1280 px; no se detectaron errores del navegador.

## Alcance futuro

- [ ] No están integrados otros sistemas ni se han validado colecciones extensas de cartuchos. Cualquier nuevo emulador requiere otra prueba de compatibilidad, tamaño, licencia y privacidad antes de mostrarse como jugable.
- [ ] EmulatorJS y js-dos permanecen como alternativas documentadas, no como integraciones activas.

## Estado de publicación

La rama `feat/playnexo-retro-foundation` está subida al repositorio remoto y superó las comprobaciones locales. La fuente de Pages permanece en `main/docs`; no se modifica `main` ni se publica en Pages como parte de esta iteración.
