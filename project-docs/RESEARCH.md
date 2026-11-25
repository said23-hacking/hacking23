# Investigación técnica del piloto retro

Consulta realizada el 24 de noviembre de 2026. El repositorio del proyecto no tenía una licencia propia declarada en GitHub; por eso se conservan los avisos de terceros aparte y no se cambia la licencia global de `hacking23`.

## Decisión para el piloto

Se elige JSNES 3.0.0 para un primer emulador NES/Famicom. Su proyecto declara Apache-2.0; documenta una API de navegador que procesa datos `ArrayBuffer` o `Uint8Array` y ofrece renderizado Canvas, teclado y gamepad. La API permite leer un archivo con el selector local del navegador y pasarlo directamente al emulador, sin `fetch` de una ROM. La distribución npm declara solo herramientas de desarrollo, no dependencias de runtime. El archivo npm examinado mide 453,423 bytes; el código ESM, la licencia, el README y los metadatos que se copian al repositorio suman 397,862 bytes. La compilación minificada listada por el paquete ronda 132 KiB, pero no se distribuye en PlayNexo. Se versiona el código fuente ESM en `docs/vendor/jsnes/3.0.0/`, no se usa CDN ni se añade un build de npm.

EmulatorJS queda como alternativa para una fase posterior con múltiples sistemas. La documentación oficial muestra que incluye varios sistemas retro y que su integración está pensada para ser embebida; el núcleo y los requisitos varían. El archivo oficial `4.2.3.7z` medido fue de 303,554,683 bytes (aprox. 290 MiB; su API de lanzamiento reporta ese tamaño). Ese bundle completo no se incorpora. Puede evaluarse más adelante una extracción muy selectiva y su compatibilidad de licencias, pero no se necesita para el piloto NES.

`js-dos` se mantiene como posible opción separada para DOS y Windows 9x, no como solución de emulación de consolas. Su `package.json` declara GPL-2.0 y sus requisitos de empaquetado son distintos.

## Límites y privacidad

La prueba acepta solo archivos `.nes` iNES de hasta 16 MiB. El código del piloto usa `File.arrayBuffer()` y `JSNES.Browser.loadROM()` con los bytes locales. No contiene formulario, función de subida, petición de ROM por red ni persistencia deliberada del archivo. El archivo vive temporalmente en memoria durante la partida; cerrar o descargar la sesión limpia las referencias de la página, sin prometer borrado seguro de memoria física.

El selector no comprueba si la persona posee los derechos del juego; solo valida formato y tamaño. La página pide utilizar copias autorizadas, no incluye ROMs ni BIOS y no enlaza sitios para descargarlas. La licencia del software emulador es independiente de los derechos sobre cada archivo de juego. Esto es una decisión técnica y no asesoría legal.

## Fuentes

- [Repositorio JSNES: guía, API, teclado, gamepad y soporte de navegador](https://github.com/bfirsh/jsnes)
- [Metadatos JSNES 3.0.0 en npm: Apache-2.0, archivos y dependencias](https://registry.npmjs.org/jsnes/3.0.0)
- [Texto de licencia Apache 2.0 distribuido con JSNES](https://raw.githubusercontent.com/bfirsh/jsnes/main/LICENSE)
- [EmulatorJS: introducción y arquitectura de integración](https://emulatorjs.org/docs/)
- [EmulatorJS: lista de núcleos y advertencia sobre Dolphin](https://emulatorjs.org/docs4devs/cores/)
- [Lanzamiento oficial EmulatorJS 4.2.3](https://github.com/EmulatorJS/EmulatorJS/releases/tag/v4.2.3)
- [js-dos 8.xx: repositorio](https://github.com/caiiiycuk/js-dos)
- [js-dos 8.xx: metadatos y GPL-2.0](https://raw.githubusercontent.com/caiiiycuk/js-dos/8.xx/package.json)
- [GitHub Pages: límites y tamaño publicado](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [MDN File API: leer archivos que selecciona el usuario](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
