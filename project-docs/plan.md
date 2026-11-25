# Plan técnico de PlayNexo

## Objetivo y límites

Ampliar el sitio estático existente sin quitar Neon Snake, Micro Pong ni Pixel Dash, conservando sus reglas, controles e identidad visual. La iteración añade un piloto realmente ejecutable de NES/Famicom: la persona selecciona un archivo `.nes` local que tenga derecho a utilizar. PlayNexo no alojará ni enlazará ROMs comerciales, firmware ni descargas protegidas. PS3, PS4, PS5, consolas modernas y los sistemas que no estén probados seguirán como información, no como juegos disponibles.

El código y los avisos de dependencias permanecen en `said23-hacking/hacking23`; no se necesita backend ni servicio de Manus. GitHub Pages sigue sirviendo desde `main/docs`. Esta prueba se prepara en `feat/playnexo-retro-foundation`; no se modifica `main` ni se publica en Pages antes de revisar la prueba.

## Arquitectura y archivos

Se conserva HTML, CSS y JavaScript nativos, sin framework ni gestor de paquetes. El sitio sirve archivos relativos y funciona en alojamiento estático.

- `docs/index.html`, `docs/styles.css` y `docs/app.js` mantienen el catálogo y la arcade. `app.js` registra metadatos, controles táctiles, creación de estado y funciones de actualización/renderizado por módulo; se preservan las tarjetas y los tres juegos existentes.
- `docs/emulation/nes.html`, `nes-player.js` y `nes-player.css` forman una página separada para el piloto NES, con estado visible, selector local, controles y límite de tamaño/formato.
- `docs/vendor/jsnes/3.0.0/` contiene código fuente ESM de JSNES y sus avisos Apache-2.0, alojados en el mismo repositorio y sin CDN.
- `project-docs/` conserva el plan, la investigación con fuentes y el estado del trabajo, fuera del contenido de GitHub Pages.

Para añadir un minijuego, se registra su metadata y sus callbacks `createState`, `update`, `draw` y controles en `gameModules`, y se añade su ficha visual a la cuadrícula existente. La estructura no cambia la ejecución de las partidas ya registradas.

## Elección técnica

Se selecciona JSNES 3.0.0 como primera integración porque su fuente ESM admite bytes `Uint8Array` en el navegador, su licencia es Apache-2.0 y el código copiado con avisos ocupa 397,862 bytes. El archivo npm medido pesa 453,423 bytes. EmulatorJS v4.2.3 ofrece varios sistemas, pero su archivo de distribución completo medido pesa 303,554,683 bytes y su licencia GPL-3.0 requiere una evaluación separada antes de redistribuir núcleos; por ello no se incorpora ese bundle. `js-dos` queda como alternativa para DOS, no para emulación de consolas. Las fuentes y comparación detalladas están en `project-docs/RESEARCH.md`.

## Privacidad, seguridad y licencias

El piloto lee el `File` seleccionado mediante `File.arrayBuffer()` y entrega esos bytes al emulador en memoria. Acepta extensión `.nes`, cabecera iNES y un máximo de 16 MiB. No contiene formulario de subida, endpoint, petición remota del archivo ni almacenamiento persistente. Al descargar de memoria o cerrar la página, libera las referencias disponibles; no promete borrado seguro de memoria física.

No se incluyen ROMs, BIOS ni enlaces a descargas. El selector no determina los derechos de uso: la interfaz pide utilizar solo archivos autorizados. La licencia de JSNES no concede derechos sobre cada juego. El código del emulador y su licencia Apache-2.0 se guardan juntos. La decisión no constituye asesoría legal.

## Diseño y controles

Se conserva el lenguaje visual arcade cálido y de alto contraste de PlayNexo. La página NES usa los mismos colores, bordes y tipografía, con diseño adaptable. En el piloto se indican teclado (flechas, Z/X, Enter y Ctrl derecho), botones táctiles y gamepad compatible; el estado actual solo promete NES/Famicom. La página y la portada se verifican en móvil y escritorio.

## Estado de aprobación

El usuario aprobó conservar y ordenar la arcade, probar NES de forma aislada y no subir archivos ni incluir ROMs. Los cambios quedan en una rama del repositorio. Solo una verificación satisfactoria permite proponer el push de esa rama; no autoriza modificar `main`, cambiar la fuente de Pages ni publicar el sitio. El estado final de pruebas y publicación se mantiene en `project-docs/TODO.md`.
