import { CampusKollerGame } from "../src/game.js";

let now = 0;
const windowListeners = {};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function createUi() {
  return {
    events: [],
    setSkinHandler(handler) {
      this.skinHandler = handler;
    },
    updateHud(data) {
      this.hud = data;
    },
    renderSkinChooser(data) {
      this.skins = data;
    },
    showStart(data) {
      this.events.push(["start", data]);
    },
    showHowTo(data) {
      this.events.push(["howTo", data]);
    },
    showPause(score) {
      this.events.push(["pause", score]);
    },
    showGameOver(data) {
      this.events.push(["gameOver", data]);
    },
    hideOverlay() {
      this.events.push(["hide"]);
    }
  };
}

function createRenderer() {
  return {
    resizeCount: 0,
    drawCount: 0,
    resize() {
      this.resizeCount += 1;
    },
    draw(model) {
      this.drawCount += 1;
      this.lastModel = model;
    }
  };
}

globalThis.window = {
  matchMedia() {
    return { matches: false, addEventListener() {}, addListener() {} };
  },
  addEventListener(type, callback) {
    (windowListeners[type] ||= []).push(callback);
  },
  setTimeout(callback) {
    callback();
  }
};

globalThis.performance = {
  now() {
    return now;
  }
};

globalThis.requestAnimationFrame = () => 1;

const storage = {
  bestScore: 0,
  selectedSkin: "basti",
  getBestScore() {
    return this.bestScore;
  },
  setBestScore(score) {
    this.bestScore = score;
  },
  getSelectedSkin() {
    return this.selectedSkin;
  },
  setSelectedSkin(id) {
    this.selectedSkin = id;
  }
};

const audio = {
  unlock() {},
  playButton() {},
  playFlap() {},
  playScore() {},
  playCrash() {}
};

const ui = createUi();
const renderer = createRenderer();
const game = new CampusKollerGame({ storage, audio, ui, renderer });
game.init();

assert(ui.events[0][0] === "start", "init should show start screen");
assert(renderer.resizeCount === 1, "renderer should resize on init");

game.handleAction();
assert(ui.events.some((event) => event[0] === "hide"), "start should hide overlay");
assert(ui.hud.state === "playing", "action should start play state");

for (let i = 0; i < 8; i += 1) {
  now += 1000 / 60;
  game.update(1 / 60);
}
assert(game.model.score >= 0, "score remains valid during play");

game.handlePause();
assert(ui.hud.state === "paused", "pause should update hud state");

game.handleAction();
assert(ui.hud.state === "playing", "primary action should resume");

game.model.player.y = 999;
game.update(1 / 60);
assert(ui.events.some((event) => event[0] === "gameOver"), "bounds crash should end run");
assert(storage.bestScore >= 0, "best score remains valid");

console.log("smoke-ok");
