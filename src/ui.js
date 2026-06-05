import { GAME_STATE, THEME } from "./config.js";

export class UIController {
  constructor(elements) {
    this.elements = elements;
    this.onSkinSelect = null;
  }

  setSkinHandler(handler) {
    this.onSkinSelect = handler;
  }

  updateHud({ score, bestScore, dailyGoal, state }) {
    this.elements.scoreText.textContent = String(score);
    this.elements.bestText.textContent = String(bestScore);
    this.elements.goalText.textContent = String(dailyGoal);
    this.elements.pauseButton.disabled = state !== GAME_STATE.PLAYING && state !== GAME_STATE.PAUSED;
    this.elements.pauseButton.textContent = state === GAME_STATE.PAUSED ? "Weiter" : "Pause";
  }

  renderSkinChooser({ skins, selectedSkinId, bestScore }) {
    this.elements.skinChooser.textContent = "";

    for (const skin of skins) {
      const button = document.createElement("button");
      const unlocked = skin.unlockScore <= bestScore;
      button.type = "button";
      button.className = "skin-button";
      button.textContent = unlocked ? skin.name : `${skin.name} ab ${skin.unlockScore}`;
      button.disabled = !unlocked;
      button.setAttribute("aria-pressed", String(selectedSkinId === skin.id));
      button.addEventListener("click", () => this.onSkinSelect?.(skin.id));
      this.elements.skinChooser.append(button);
    }
  }

  showStart({ bestScore, dailyGoal }) {
    this.showOverlay({
      screen: "start",
      eyebrow: `Bestscore ${bestScore} | ${THEME.dailyGoalPrefix}: ${dailyGoal}`,
      title: THEME.title,
      text: THEME.subtitle,
      primary: "Spielen",
      howToVisible: true,
      skinChooserVisible: true
    });
  }

  showHowTo({ dailyGoal }) {
    this.showOverlay({
      screen: "how-to",
      eyebrow: `${THEME.dailyGoalPrefix}: ${dailyGoal}`,
      title: "So geht's",
      text: THEME.howTo,
      primary: "Alles klar",
      howToVisible: false,
      skinChooserVisible: false
    });
  }

  showPause(score) {
    this.showOverlay({
      screen: "pause",
      eyebrow: "Kurze Atempause",
      title: "Pause",
      text: `Aktueller Panikpegel: ${score}`,
      primary: "Weiter",
      howToVisible: true,
      skinChooserVisible: false
    });
  }

  showGameOver({ score, bestScore, comment, unlockedSkinName }) {
    const unlockText = unlockedSkinName ? ` Neuer Skin: ${unlockedSkinName}.` : "";
    this.showOverlay({
      screen: "game-over",
      eyebrow: `Score ${score} | Best ${bestScore}`,
      title: "Exmatrikuliert",
      text: `${comment}${unlockText}`,
      primary: "Nochmal",
      howToVisible: true,
      skinChooserVisible: true
    });
  }

  hideOverlay() {
    this.elements.overlay.hidden = true;
  }

  showOverlay({ screen, eyebrow, title, text, primary, howToVisible, skinChooserVisible }) {
    this.elements.overlay.dataset.screen = screen;
    this.elements.eyebrowText.textContent = eyebrow;
    this.elements.titleText.textContent = title;
    this.elements.overlayText.textContent = text;
    this.elements.primaryButton.textContent = primary;
    this.elements.howToButton.hidden = !howToVisible;
    this.elements.skinChooser.hidden = !skinChooserVisible;
    this.elements.overlay.hidden = false;
  }
}
