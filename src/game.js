import { GAME_STATE, PHYSICS, THEME, WORLD } from "./config.js";
import { chooseByIndex, clamp, todaySeed } from "./utils.js";

const PLAYABLE_HEIGHT = WORLD.height - WORLD.ground;

export class CampusKollerGame {
  constructor({ storage, audio, ui, renderer }) {
    this.storage = storage;
    this.audio = audio;
    this.ui = ui;
    this.renderer = renderer;
    this.bestScore = storage.getBestScore();
    this.selectedSkinId = storage.getSelectedSkin(this.bestScore);
    this.dailyGoal = 6 + (todaySeed() % 7);
    this.state = GAME_STATE.START;
    this.lastTime = 0;
    this.accumulator = 0;
    this.rafId = 0;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.model = this.createFreshModel();
  }

  init() {
    this.bindMotionPreference();
    this.ui.setSkinHandler((skinId) => this.selectSkin(skinId));
    this.renderer.resize();
    this.syncUi();
    this.ui.showStart({ bestScore: this.bestScore, dailyGoal: this.dailyGoal });
    window.addEventListener("resize", () => {
      this.renderer.resize();
      this.render();
    });
    this.rafId = requestAnimationFrame((time) => this.frame(time));
  }

  handleAction() {
    this.audio.unlock();
    this.audio.playButton();

    if (this.state === GAME_STATE.HOW_TO) {
      this.state = GAME_STATE.START;
      this.ui.showStart({ bestScore: this.bestScore, dailyGoal: this.dailyGoal });
      this.syncUi();
      return;
    }

    if (this.state === GAME_STATE.PAUSED) {
      this.resume();
      return;
    }

    if (this.state === GAME_STATE.START || this.state === GAME_STATE.GAME_OVER) {
      this.startRun();
      return;
    }

    if (this.state === GAME_STATE.PLAYING) {
      this.flap();
    }
  }

  handlePause(fromBlur = false) {
    if (this.state === GAME_STATE.PLAYING) {
      this.state = GAME_STATE.PAUSED;
      this.audio.playButton();
      this.ui.showPause(this.model.score);
      this.syncUi();
      return;
    }

    if (!fromBlur && this.state === GAME_STATE.PAUSED) {
      this.resume();
    }
  }

  showHowTo() {
    if (this.state === GAME_STATE.PLAYING) {
      this.handlePause();
    }
    this.state = GAME_STATE.HOW_TO;
    this.audio.unlock();
    this.audio.playButton();
    this.ui.showHowTo({ dailyGoal: this.dailyGoal });
    this.syncUi();
  }

  selectSkin(skinId) {
    const skin = THEME.skins.find((item) => item.id === skinId);
    if (!skin || skin.unlockScore > this.bestScore) {
      return;
    }

    this.selectedSkinId = skin.id;
    this.storage.setSelectedSkin(skin.id);
    this.audio.playButton();
    this.syncUi();
    this.render();
  }

  startRun() {
    this.model = this.createFreshModel();
    this.state = GAME_STATE.PLAYING;
    this.lastTime = performance.now();
    this.ui.hideOverlay();
    this.syncUi();
    this.flap();
  }

  resume() {
    this.state = GAME_STATE.PLAYING;
    this.lastTime = performance.now();
    this.ui.hideOverlay();
    this.syncUi();
  }

  flap() {
    if (this.state !== GAME_STATE.PLAYING) {
      return;
    }

    this.model.player.velocity = PHYSICS.flapVelocity;
    this.model.player.flapPose = 1;
    this.audio.playFlap();
  }

  frame(time) {
    const rawDt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
    this.lastTime = time;
    this.accumulator += Math.min(rawDt, 0.05);

    while (this.accumulator >= 1 / 120) {
      this.update(1 / 120);
      this.accumulator -= 1 / 120;
    }

    this.render();
    this.rafId = requestAnimationFrame((nextTime) => this.frame(nextTime));
  }

  update(dt) {
    this.updateEffects(dt);

    if (this.state !== GAME_STATE.PLAYING) {
      return;
    }

    const model = this.model;
    model.distance += model.speed * dt;
    model.speed = clamp(
      PHYSICS.baseObstacleSpeed + model.score * 3.6,
      PHYSICS.baseObstacleSpeed,
      PHYSICS.maxObstacleSpeed
    );
    model.currentGap = clamp(PHYSICS.baseGap - model.score * 1.2, PHYSICS.minGap, PHYSICS.baseGap);

    this.updatePlayer(dt);
    this.updateObstacles(dt);
    this.updateClouds(dt);

    if (this.hitWorldBounds() || this.hitObstacle()) {
      this.endRun();
    }
  }

  updatePlayer(dt) {
    const player = this.model.player;
    player.velocity = clamp(player.velocity + PHYSICS.gravity * dt, -900, PHYSICS.maxFallVelocity);
    player.y += player.velocity * dt;
    player.rotation = clamp(player.velocity / 560, -0.58, 1.08);
    player.flapPose = Math.max(0, player.flapPose - dt * 5.5);
  }

  updateObstacles(dt) {
    const obstacles = this.model.obstacles;

    for (const obstacle of obstacles) {
      obstacle.x -= this.model.speed * dt;
      if (!obstacle.scored && obstacle.x + PHYSICS.obstacleWidth < this.model.player.x - this.model.player.radius) {
        obstacle.scored = true;
        this.model.score += 1;
        this.audio.playScore();
        this.spawnScoreEffects();
        this.checkDailyGoal();
        this.syncUi();
      }
    }

    while (obstacles.length && obstacles[0].x + PHYSICS.obstacleWidth < -18) {
      obstacles.shift();
    }

    const last = obstacles[obstacles.length - 1];
    if (last && last.x < WORLD.width - PHYSICS.spacing) {
      this.addObstacle(last.x + PHYSICS.spacing);
    }
  }

  updateClouds(dt) {
    for (const cloud of this.model.clouds) {
      cloud.x -= cloud.speed * dt;
      if (cloud.x < -96) {
        cloud.x = WORLD.width + 76;
      }
    }
  }

  updateEffects(dt) {
    this.model.particles = this.model.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * dt,
        y: particle.y + particle.vy * dt,
        vy: particle.vy + 420 * dt,
        life: particle.life - dt
      }))
      .filter((particle) => particle.life > 0);

    this.model.floatingTexts = this.model.floatingTexts
      .map((item) => ({ ...item, y: item.y - 34 * dt, life: item.life - dt }))
      .filter((item) => item.life > 0);
  }

  hitWorldBounds() {
    const player = this.model.player;
    return player.y - player.radius < 0 || player.y + player.radius > PLAYABLE_HEIGHT;
  }

  hitObstacle() {
    const player = this.model.player;
    const radius = player.radius - 5;

    for (const obstacle of this.model.obstacles) {
      const topBottom = obstacle.gapY - obstacle.gap / 2;
      const bottomTop = obstacle.gapY + obstacle.gap / 2;
      if (this.circleTouchesRect(player, radius, obstacle.x, 0, PHYSICS.obstacleWidth, topBottom)) {
        return true;
      }
      if (this.circleTouchesRect(player, radius, obstacle.x, bottomTop, PHYSICS.obstacleWidth, PLAYABLE_HEIGHT - bottomTop)) {
        return true;
      }
    }

    return false;
  }

  circleTouchesRect(circle, radius, x, y, width, height) {
    if (height <= 0) {
      return false;
    }

    const nearestX = clamp(circle.x, x, x + width);
    const nearestY = clamp(circle.y, y, y + height);
    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;
    return dx * dx + dy * dy < radius * radius;
  }

  endRun() {
    if (this.state === GAME_STATE.GAME_OVER) {
      return;
    }

    const previousBest = this.bestScore;
    this.state = GAME_STATE.GAME_OVER;
    this.audio.playCrash();
    this.spawnCrashEffects();

    if (this.model.score > this.bestScore) {
      this.bestScore = this.model.score;
      this.storage.setBestScore(this.bestScore);
    }

    const unlockedSkin = THEME.skins.find(
      (skin) => skin.unlockScore > previousBest && skin.unlockScore <= this.bestScore
    );
    const comment = chooseByIndex(THEME.comments, this.model.score + Math.floor(this.model.distance));
    this.syncUi();
    this.ui.showGameOver({
      score: this.model.score,
      bestScore: this.bestScore,
      comment,
      unlockedSkinName: unlockedSkin?.name
    });
  }

  createFreshModel() {
    const model = {
      score: 0,
      distance: 0,
      speed: PHYSICS.baseObstacleSpeed,
      currentGap: PHYSICS.baseGap,
      player: {
        x: WORLD.playerStart.x,
        y: WORLD.playerStart.y,
        radius: 19,
        velocity: 0,
        rotation: 0,
        flapPose: 0
      },
      obstacles: [],
      particles: [],
      floatingTexts: [],
      dailyGoalReached: false,
      clouds: [
        { x: 52, y: 90, scale: 0.88, speed: 10 },
        { x: 272, y: 150, scale: 1.16, speed: 14 },
        { x: 382, y: 58, scale: 0.72, speed: 8 }
      ],
      obstacleIndex: 0,
      reducedMotion: this.reducedMotion
    };

    this.model = model;
    this.addObstacle(WORLD.width + 126);
    this.addObstacle(WORLD.width + 126 + PHYSICS.spacing);
    return model;
  }

  addObstacle(x) {
    const index = this.model.obstacleIndex;
    this.model.obstacleIndex += 1;
    this.model.obstacles.push({
      x,
      gapY: this.nextGapY(index),
      gap: this.model.currentGap,
      type: chooseByIndex(THEME.obstacles, index),
      scored: false
    });
  }

  nextGapY(index) {
    const wave = Math.sin(index * 1.12 + todaySeed() * 0.001) * 82;
    const ripple = Math.sin(index * 2.24 + 0.8) * 34;
    return clamp(278 + wave + ripple, 182, PLAYABLE_HEIGHT - 174);
  }

  spawnScoreEffects() {
    const player = this.model.player;
    const text = chooseByIndex(THEME.scoreBursts, this.model.score);
    this.model.floatingTexts.push({
      text,
      x: player.x + 38,
      y: player.y - 22,
      life: 0.7,
      maxLife: 0.7
    });

    for (let i = 0; i < 10; i += 1) {
      this.model.particles.push({
        x: player.x + 24,
        y: player.y,
        vx: 80 + Math.random() * 120,
        vy: -130 + Math.random() * 190,
        size: 2 + Math.random() * 3,
        color: i % 2 ? "#f4d35e" : "#ffffff",
        life: 0.45,
        maxLife: 0.45
      });
    }
    this.capEffects();
  }

  spawnCrashEffects() {
    const player = this.model.player;
    for (let i = 0; i < 28; i += 1) {
      const angle = (Math.PI * 2 * i) / 28;
      const speed = 90 + Math.random() * 210;
      this.model.particles.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: i % 3 === 0 ? "#d94d3d" : "#f4d35e",
        life: 0.75,
        maxLife: 0.75
      });
    }
    this.capEffects();
  }

  checkDailyGoal() {
    if (this.model.dailyGoalReached || this.model.score < this.dailyGoal) {
      return;
    }

    this.model.dailyGoalReached = true;
    this.model.floatingTexts.push({
      text: "Tagesziel!",
      x: WORLD.width / 2,
      y: 138,
      life: 1.15,
      maxLife: 1.15
    });
  }

  capEffects() {
    if (this.model.particles.length > 80) {
      this.model.particles.splice(0, this.model.particles.length - 80);
    }

    if (this.model.floatingTexts.length > 6) {
      this.model.floatingTexts.splice(0, this.model.floatingTexts.length - 6);
    }
  }

  syncUi() {
    this.ui.updateHud({
      score: this.model.score,
      bestScore: this.bestScore,
      dailyGoal: this.dailyGoal,
      state: this.state
    });
    this.ui.renderSkinChooser({
      skins: THEME.skins,
      selectedSkinId: this.selectedSkinId,
      bestScore: this.bestScore
    });
  }

  render() {
    const skin = THEME.skins.find((item) => item.id === this.selectedSkinId) || THEME.skins[0];
    this.renderer.draw({
      ...this.model,
      skin,
      isActive: this.state === GAME_STATE.PLAYING || this.state === GAME_STATE.PAUSED
    });
  }

  bindMotionPreference() {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event) => {
      this.reducedMotion = event.matches;
      this.model.reducedMotion = event.matches;
    };

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", updatePreference);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(updatePreference);
    }
  }
}
