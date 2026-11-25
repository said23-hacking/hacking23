import { Browser, Controller } from "../vendor/jsnes/3.0.0/src/index.js";

const MAX_ROM_BYTES = 16 * 1024 * 1024;
const input = document.querySelector("#rom-file");
const screen = document.querySelector("#nes-screen");
const placeholder = document.querySelector("#screen-placeholder");
const status = document.querySelector("#player-status");
const unloadButton = document.querySelector("#unload-rom");
let emulator = null;
const heldPointers = new Map();

function setStatus(message, kind = "info") {
  status.textContent = message;
  status.dataset.kind = kind;
}

function releasePointer(pointerId) {
  const held = heldPointers.get(pointerId);
  if (!held) return;
  if (emulator) emulator.nes.buttonUp(1, held.button);
  held.buttonElement.classList.remove("is-held");
  heldPointers.delete(pointerId);
}

function stopEmulator() {
  for (const pointerId of heldPointers.keys()) releasePointer(pointerId);
  if (!emulator) return;

  const current = emulator;
  emulator = null;
  current.stop();
  current.nes.romData = null;
  current.nes.rom = null;
  current.nes.mmap = null;
  current.destroy();
  screen.replaceChildren();
  placeholder.hidden = false;
  unloadButton.disabled = true;
}

async function loadLocalRom(file) {
  if (!file) return;
  stopEmulator();

  if (!/\.nes$/i.test(file.name)) {
    setStatus("Elige un archivo con extensión .nes en formato iNES. No se ha cargado ni enviado nada.", "error");
    input.value = "";
    return;
  }
  if (file.size < 16 || file.size > MAX_ROM_BYTES) {
    setStatus("El archivo debe medir entre 16 bytes y 16 MiB. No se ha cargado ni enviado nada.", "error");
    input.value = "";
    return;
  }

  setStatus("Leyendo el archivo local en este navegador…");
  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes[0] !== 0x4e || bytes[1] !== 0x45 || bytes[2] !== 0x53 || bytes[3] !== 0x1a) {
      throw new Error("La cabecera no corresponde al formato iNES.");
    }

    emulator = new Browser({
      container: screen,
      onError(error) {
        setStatus(`El emulador encontró un error: ${error.message || "archivo o juego incompatible"}`, "error");
      },
    });
    emulator.loadROM(bytes);
    placeholder.hidden = true;
    unloadButton.disabled = false;
    setStatus(`“${file.name}” está en ejecución desde memoria local. Este código no lo sube ni lo guarda.`, "success");
  } catch (error) {
    stopEmulator();
    setStatus(`No se pudo iniciar este archivo: ${error.message || "formato no compatible"}`, "error");
  } finally {
    input.value = "";
  }
}

input.addEventListener("change", () => loadLocalRom(input.files?.[0]));
unloadButton.addEventListener("click", () => {
  stopEmulator();
  setStatus("Se cerró la partida y se liberaron las referencias del archivo de la sesión.");
});

const buttonNames = {
  a: Controller.BUTTON_A,
  b: Controller.BUTTON_B,
  select: Controller.BUTTON_SELECT,
  start: Controller.BUTTON_START,
  up: Controller.BUTTON_UP,
  down: Controller.BUTTON_DOWN,
  left: Controller.BUTTON_LEFT,
  right: Controller.BUTTON_RIGHT,
};

document.querySelectorAll("[data-button]").forEach((buttonElement) => {
  const button = buttonNames[buttonElement.dataset.button];
  if (button === undefined) return;

  buttonElement.addEventListener("pointerdown", (event) => {
    if (!emulator) return;
    event.preventDefault();
    buttonElement.setPointerCapture?.(event.pointerId);
    emulator.nes.buttonDown(1, button);
    buttonElement.classList.add("is-held");
    heldPointers.set(event.pointerId, { button, buttonElement });
  });
  for (const eventName of ["pointerup", "pointercancel", "lostpointercapture", "pointerleave"]) {
    buttonElement.addEventListener(eventName, (event) => releasePointer(event.pointerId));
  }
});

window.addEventListener("blur", () => {
  for (const pointerId of heldPointers.keys()) releasePointer(pointerId);
});
window.addEventListener("pagehide", stopEmulator);
