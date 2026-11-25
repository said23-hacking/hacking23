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

## Juegos homebrew para NES

Se añadió Solar Wars, juego freeware de Chris Covell, desde el archivo que enlaza la página oficial del autor. El `README.TXT` de esa distribución permite descargar o transmitir el juego, prohíbe modificar el juego o el archivo ZIP sin permiso escrito y especifica conservar juntos `SolarWars2001.NES` y `README.TXT`. PlayNexo incluye ambos archivos originales, sin alterar, junto con un enlace visible a la nota. Se validó el inicio del ROM en el navegador con JSNES: el player informa de ejecución, crea su Canvas y oculta el marcador. Esta comprobación no valida toda la partida ni los controles del segundo jugador; por eso se rotula como inicio verificado, no como compatibilidad completa. [1] [2]

Spacegulls de Morphcat Games se muestra como enlace a la ficha oficial. La página dice que el producto descargable incluye una ROM NES y permite elegir el precio. No encontramos en esa ficha una autorización expresa para copiar o redistribuir el archivo, así que no se aloja en PlayNexo. Aunque la ficha identifica NES ROM, falta probar la ROM descargada por el usuario con JSNES; no se afirma compatibilidad. [3]

La ROM de Solar Wars se obtiene y carga desde el mismo origen del sitio cuando la persona pulsa el botón específico. La ROM que selecciona localmente cada usuario sigue leyéndose en memoria del navegador, sin subirla ni guardarla. El cambio no altera `main` ni publica Pages.

### Fuentes de juegos

- [1] [Página oficial de Solar Wars de Chris Covell](https://www.chrismcovell.com/solarwars.html)
- [2] [Archivo SolarWars.zip enlazado por el autor, contiene la ROM y README.TXT](https://www.chrismcovell.com/data/SolarWars.zip)
- [3] [Ficha oficial de Spacegulls en itch.io](https://morphcatgames.itch.io/spacegulls)
