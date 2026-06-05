import { AudioManager } from "./audio.js";
import { CampusKollerGame } from "./game.js";
import { InputController } from "./input.js";
import { Renderer } from "./renderer.js";
import { StorageManager } from "./storage.js";
import { UIController } from "./ui.js";

const elements = {
  canvas: document.getElementById("gameCanvas"),
  scoreText: document.getElementById("scoreText"),
  bestText: document.getElementById("bestText"),
  goalText: document.getElementById("goalText"),
  pauseButton: document.getElementById("pauseButton"),
  overlay: document.getElementById("overlay"),
  eyebrowText: document.getElementById("eyebrowText"),
  titleText: document.querySelector("#overlay h1"),
  overlayText: document.getElementById("overlayText"),
  primaryButton: document.getElementById("primaryButton"),
  howToButton: document.getElementById("howToButton"),
  skinChooser: document.getElementById("skinChooser")
};

const game = new CampusKollerGame({
  storage: new StorageManager(),
  audio: new AudioManager(),
  ui: new UIController(elements),
  renderer: new Renderer(elements.canvas)
});

new InputController({
  canvas: elements.canvas,
  primaryButton: elements.primaryButton,
  pauseButton: elements.pauseButton,
  howToButton: elements.howToButton,
  onAction: () => game.handleAction(),
  onPause: (fromBlur) => game.handlePause(fromBlur),
  onHowTo: () => game.showHowTo()
});

game.init();
