import { PHYSICS, THEME, WORLD } from "../src/config.js";
import { Renderer } from "../src/renderer.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

globalThis.window = {
  devicePixelRatio: 2
};

const noop = () => {};
const context = new Proxy(
  {
    createLinearGradient() {
      return { addColorStop: noop };
    },
    measureText(text) {
      return { width: String(text).length * 8 };
    }
  },
  {
    get(target, property) {
      if (property in target) {
        return target[property];
      }
      return noop;
    },
    set(target, property, value) {
      target[property] = value;
      return true;
    }
  }
);

const canvas = {
  width: 0,
  height: 0,
  getContext() {
    return context;
  }
};

const renderer = new Renderer(canvas);
renderer.resize();
renderer.draw({
  score: 3,
  distance: 120,
  reducedMotion: false,
  isActive: true,
  skin: THEME.skins[0],
  player: {
    x: WORLD.playerStart.x,
    y: WORLD.playerStart.y,
    velocity: 0,
    radius: 19,
    rotation: 0,
    flapPose: 0.5
  },
  obstacles: [
    {
      x: 260,
      gapY: 300,
      gap: 180,
      type: THEME.obstacles[0],
      scored: false
    }
  ],
  particles: [
    { x: 100, y: 100, size: 3, life: 0.4, maxLife: 0.5, color: "#fff" }
  ],
  floatingTexts: [
    { x: 150, y: 150, text: "ECTS!", life: 0.5, maxLife: 0.7 }
  ],
  clouds: [
    { x: 52, y: 90, scale: 0.88, speed: 10 }
  ],
  speed: PHYSICS.baseObstacleSpeed
});

assert(canvas.width === WORLD.width * 2, "canvas should scale to device pixel ratio");
console.log("render-smoke-ok");
