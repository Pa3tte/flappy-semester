export class InputController {
  constructor({ canvas, primaryButton, pauseButton, howToButton, onAction, onPause, onHowTo }) {
    this.onAction = onAction;
    this.onPause = onPause;
    this.onHowTo = onHowTo;

    canvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      this.onAction();
    });

    primaryButton.addEventListener("click", () => this.onAction());
    pauseButton.addEventListener("click", () => this.onPause());
    howToButton.addEventListener("click", () => this.onHowTo());

    window.addEventListener("keydown", (event) => this.handleKey(event));
    window.addEventListener("blur", () => this.onPause(true));
  }

  handleKey(event) {
    if (event.repeat) {
      return;
    }

    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
      event.preventDefault();
      this.onAction();
    }

    if (event.code === "Escape" || event.code === "KeyP") {
      event.preventDefault();
      this.onPause();
    }

    if (event.code === "KeyH") {
      event.preventDefault();
      this.onHowTo();
    }
  }
}
