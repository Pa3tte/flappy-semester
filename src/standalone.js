(() => {
  "use strict";

  // CONFIG
  const GAME_STATE = {
    START: "start",
    HOW_TO: "howTo",
    PLAYING: "playing",
    PAUSED: "paused",
    GAME_OVER: "gameOver"
  };

  const WORLD = {
    width: 432,
    height: 768,
    ground: 102,
    playerStart: { x: 126, y: 318 }
  };

  const PHYSICS = {
    gravity: 1760,
    flapVelocity: -535,
    maxFallVelocity: 760,
    baseObstacleSpeed: 166,
    maxObstacleSpeed: 226,
    obstacleWidth: 74,
    baseGap: 194,
    minGap: 154,
    spacing: 252
  };

  const GAME_TIMING = {
    fixedStep: 1 / 120,
    maxFrameDelta: 0.05,
    missionUiRefresh: 0.5
  };

  const PLAYER_TUNING = {
    minVelocity: -900,
    rotationDivisor: 560,
    minRotation: -0.58,
    maxRotation: 1.08,
    flapPoseDecay: 5.5
  };

  const OBSTACLE_TUNING = {
    speedPerScore: 3.6,
    gapTightenPerScore: 1.2,
    despawnPadding: 18,
    cloudDespawnX: -96,
    cloudResetX: 76
  };

  const EFFECT_TUNING = {
    particleGravity: 420,
    floatingTextSpeed: 34,
    feedbackTextSpeed: 28
  };

  // CONTENT
  const THEME = {
    title: "Flappy\nSemester",
    subtitle: "Tap. Flieg. Besteh die Uni.",
    howTo: "Tippen oder Space = Flap.\nUni-Chaos ausweichen.",
    comments: [
      "Modulhandbuch sagt nein.",
      "Koffein leer.",
      "ECTS unverstanden.",
      "Deadline gewinnt.",
      "Mensa blockiert.",
      "Compiler weint.",
      "Crashkurs bestanden."
    ],
    scoreBursts: ["ECTS!", "Koffein!", "Noch wach!", "Build gruen!", "Fast akademisch!"],
    obstacles: [
      { label: "WHITE WIRE", detail: "ENERGY", color: "#101820" },
      { label: "DEADLINE", detail: "23:59", color: "#b83b34" },
      { label: "MODUL", detail: "450 S.", color: "#315f7d" }
    ],
    skins: [
      {
        id: "erstiEnte",
        name: "Ersti-Ente",
        title: "Hat den Raumplan verloren",
        description: "Mutig. Planlos. Bereit.",
        priceCoffee: 0,
        unlock: { type: "default" },
        colorPrimary: "#2f9b5f",
        colorSecondary: "#dff5da",
        hair: "#3b241c",
        laptop: "#26323a",
        shape: "duck",
        trail: "soft"
      },
      {
        id: "kaffeeKobold",
        name: "Kaffee-Kobold",
        title: "Koffein statt Schlaf",
        description: "Koffein im Blut.",
        priceCoffee: 250,
        unlock: { type: "coffee", amount: 250 },
        colorPrimary: "#6f4a2f",
        colorSecondary: "#d9a066",
        hair: "#2d1b12",
        laptop: "#26323a",
        shape: "goblin",
        trail: "coffee"
      },
      {
        id: "schlafmangelTaube",
        name: "Schlafmangel-Taube",
        title: "Seit Dienstag wach",
        description: "Blinzelt aus Prinzip nicht.",
        priceCoffee: 500,
        unlock: { type: "coffee", amount: 500 },
        colorPrimary: "#64748b",
        colorSecondary: "#cbd5e1",
        hair: "#ced5dc",
        laptop: "#253142",
        shape: "bird",
        trail: "zzz"
      },
      {
        id: "pruefungsamtPhantom",
        name: "Pruefungsamt-Phantom",
        title: "Nur mittwochs sichtbar",
        description: "Erscheint nach Fristablauf.",
        priceCoffee: 0,
        unlock: { type: "milestone", milestone: "reach_score_25" },
        colorPrimary: "#6d28d9",
        colorSecondary: "#ddd6fe",
        hair: "#f8f7ff",
        laptop: "#2f214c",
        shape: "ghost",
        trail: "mist"
      },
      {
        id: "bachelorBerserker",
        name: "Bachelor-Berserker",
        title: "Abgabe in 11 Minuten",
        description: "Formatiert im Rage-Modus.",
        priceCoffee: 1000,
        unlock: { type: "coffee_and_milestone", amount: 1000, milestone: "complete_10_missions" },
        colorPrimary: "#b91c1c",
        colorSecondary: "#fecaca",
        hair: "#2d1515",
        laptop: "#351d1d",
        shape: "berserker",
        trail: "sparks"
      },
      {
        id: "mensaMoewenlord",
        name: "Mensa-Moewenlord",
        title: "Pommes sind sein Recht",
        description: "Stiehlt Snacks und Wuerde.",
        priceCoffee: 1500,
        unlock: { type: "coffee_and_milestone", amount: 1500, milestone: "survive_25_sabotages" },
        colorPrimary: "#0f766e",
        colorSecondary: "#ccfbf1",
        hair: "#f1f5f9",
        laptop: "#164e63",
        shape: "seagull",
        trail: "crumbs"
      },
      {
        id: "ectsDrache",
        name: "ECTS-Drache",
        title: "Hortet Leistungspunkte",
        description: "Selten? Nein. Teuer.",
        priceCoffee: 3000,
        unlock: { type: "coffee_and_milestone", amount: 3000, milestone: "reach_score_50" },
        colorPrimary: "#ea580c",
        colorSecondary: "#fed7aa",
        hair: "#7c2d12",
        laptop: "#431407",
        shape: "dragon",
        trail: "fire"
      }
    ],
    opponents: [
      {
        id: "profDeadline",
        name: "profDeadline",
        displayName: "Prof. Deadline",
        unlockScore: 0,
        difficultyHint: "Sabotiert fair.",
        shortTaunts: ["Tick tack.", "Frist naht.", "Noch wach?", "Abgabe jetzt."],
        actionTexts: {
          warnShift: "Frist verschoben.",
          warnShrink: "Neue Ordnung.",
          warnBluff: "Achtung Papierkram.",
          shift: "Abgabe vorgezogen.",
          shrink: "Luecke? Welche Luecke?",
          bluff: "Nur Kleingedrucktes."
        }
      }
    ]
  };

  const OPPONENT_RULES = {
    relativeMinGap: 0.18,
    gapMargin: 70,
    minReactionTime: 0.78,
    safeDistanceFromPlayer: 190,
    targetLookAhead: 160,
    initialCooldown: 2.4,
    messageCooldown: 7.5,
    comboChance: 0.24,
    rerollChance: 0.16
  };

  const RUN_REWARDS = {
    coffeePerScore: 1,
    coffeePerSabotage: 5
  };

  const FEEDBACK = {
    maxTexts: 4,
    textDuration: 0.85,
    missionDuration: 1.15,
    pipeHighlightDuration: 1.25,
    crashShakeDuration: 0.25,
    crashShakeIntensity: 5
  };

  const RUN_MISSIONS = [
    {
      id: "score_10",
      text: "Erreiche 10 ECTS.",
      shortText: "10 ECTS",
      reward: 25,
      isComplete(game) {
        return game.model.score >= 10;
      },
      progress(game) {
        return `${Math.min(game.model.score, 10)}/10`;
      }
    },
    {
      id: "survive_2_sabotages",
      text: "Ueberlebe 2 Sabotagen.",
      shortText: "2 Sabotagen",
      reward: 30,
      isComplete(game) {
        return game.model.stats.sabotagesSurvived >= 2;
      },
      progress(game) {
        return `${Math.min(game.model.stats.sabotagesSurvived, 2)}/2`;
      }
    },
    {
      id: "fly_15_seconds",
      text: "Fliege 15 Sekunden.",
      shortText: "15 Sek.",
      reward: 20,
      isComplete(game) {
        return game.model.stats.runSeconds >= 15;
      },
      progress(game) {
        return `${Math.min(Math.floor(game.model.stats.runSeconds), 15)}/15`;
      }
    },
    {
      id: "pass_5_pipes",
      text: "Schaffe 5 Saeulen.",
      shortText: "5 Saeulen",
      reward: 20,
      isComplete(game) {
        return game.model.stats.pipesPassed >= 5;
      },
      progress(game) {
        return `${Math.min(game.model.stats.pipesPassed, 5)}/5`;
      }
    }
  ];

  const STORAGE_KEYS = {
    bestScore: "campus-koller-best-score",
    coffee: "campus-koller-coffee",
    selectedSkin: "campus-koller-selected-skin",
    unlockedCharacters: "campus-koller-unlocked-characters",
    selectedCharacter: "campus-koller-selected-character",
    progressStats: "campus-koller-progress-stats",
    selectedOpponent: "campus-koller-selected-opponent",
    customOpponentName: "campus-koller-custom-opponent-name"
  };

  const PLAYABLE_HEIGHT = WORLD.height - WORLD.ground;

  // GENERAL HELPERS
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function choose(items, index) {
    return items[Math.abs(index) % items.length];
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function getOpponentDifficulty(score) {
    if (score < 5) {
      return { tier: 0, name: "warmup", actionChance: 0, cooldown: 9999, maxGapShift: 0, gapShrinkFactor: 1, minGapHeight: 145, maxComboActions: 0, tierMessage: "" };
    }
    if (score < 15) {
      return { tier: 1, name: "annoying", actionChance: 0.3, cooldown: 4.3, maxGapShift: 50, gapShrinkFactor: 0.9, minGapHeight: 136, maxComboActions: 1, tierMessage: "" };
    }
    if (score < 20) {
      return { tier: 2, name: "stress", actionChance: 0.5, cooldown: 3.15, maxGapShift: 74, gapShrinkFactor: 0.82, minGapHeight: 120, maxComboActions: 1, tierMessage: "Pruefungsphase beginnt." };
    }
    if (score < 30) {
      return { tier: 2, name: "crunch", actionChance: 0.68, cooldown: 2.35, maxGapShift: 84, gapShrinkFactor: 0.78, minGapHeight: 114, maxComboActions: 1, tierMessage: "" };
    }
    if (score < 50) {
      return { tier: 3, name: "exam_phase", actionChance: 0.72, cooldown: 2.15, maxGapShift: 96, gapShrinkFactor: 0.76, minGapHeight: 108, maxComboActions: 2, tierMessage: "Klausurenwoche." };
    }
    return { tier: 4, name: "finals", actionChance: 0.78, cooldown: 1.95, maxGapShift: 112, gapShrinkFactor: 0.72, minGapHeight: 100, maxComboActions: 2, tierMessage: "Finals." };
  }

  function todaySeed() {
    const date = new Date();
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  // STORAGE / PROGRESS
  function readStorage(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_error) {
      // Storage can be blocked in private browsing; the game still starts.
    }
  }

  function readJsonStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function defaultProgressStats(bestScore = 0) {
    return {
      bestScore,
      totalRuns: 0,
      missionsCompleted: 0,
      sabotagesSurvivedTotal: 0,
      totalCoffeeEarned: 0
    };
  }

  function normalizeProgressStats(stats, bestScore) {
    const defaults = defaultProgressStats(bestScore);
    return {
      bestScore: Math.max(Number(stats && stats.bestScore) || 0, bestScore),
      totalRuns: Number(stats && stats.totalRuns) || defaults.totalRuns,
      missionsCompleted: Number(stats && stats.missionsCompleted) || defaults.missionsCompleted,
      sabotagesSurvivedTotal: Number(stats && stats.sabotagesSurvivedTotal) || defaults.sabotagesSurvivedTotal,
      totalCoffeeEarned: Number(stats && stats.totalCoffeeEarned) || defaults.totalCoffeeEarned
    };
  }

  function loadProgress() {
    const defaultCharacter = THEME.skins[0].id;
    const bestScore = Number(readStorage(STORAGE_KEYS.bestScore, "0"));
    const unlockedCharacters = readJsonStorage(STORAGE_KEYS.unlockedCharacters, [defaultCharacter]);
    const selectedCharacterId = readStorage(
      STORAGE_KEYS.selectedCharacter,
      readStorage(STORAGE_KEYS.selectedSkin, defaultCharacter)
    );
    const stats = normalizeProgressStats(readJsonStorage(STORAGE_KEYS.progressStats, {}), bestScore);
    const validUnlocked = Array.isArray(unlockedCharacters)
      ? unlockedCharacters.filter((id) => THEME.skins.some((skin) => skin.id === id))
      : [defaultCharacter];
    if (!validUnlocked.includes(defaultCharacter)) {
      validUnlocked.unshift(defaultCharacter);
    }
    if (selectedCharacterId !== defaultCharacter && THEME.skins.some((skin) => skin.id === selectedCharacterId) && !validUnlocked.includes(selectedCharacterId)) {
      validUnlocked.push(selectedCharacterId);
    }

    return {
      bestScore,
      coffee: Number(readStorage(STORAGE_KEYS.coffee, "0")),
      unlockedCharacters: validUnlocked,
      selectedCharacterId: THEME.skins.some((skin) => skin.id === selectedCharacterId) ? selectedCharacterId : defaultCharacter,
      stats
    };
  }

  function saveProgress(progress) {
    writeStorage(STORAGE_KEYS.bestScore, String(progress.bestScore));
    writeStorage(STORAGE_KEYS.coffee, String(progress.coffee));
    writeStorage(STORAGE_KEYS.unlockedCharacters, JSON.stringify(progress.unlockedCharacters));
    writeStorage(STORAGE_KEYS.selectedCharacter, progress.selectedCharacterId);
    writeStorage(STORAGE_KEYS.progressStats, JSON.stringify(progress.stats || defaultProgressStats(progress.bestScore)));
  }

  function isMilestoneMet(milestoneId, progress) {
    const stats = progress.stats || defaultProgressStats(progress.bestScore);
    if (milestoneId === "reach_score_25") {
      return progress.bestScore >= 25 || stats.bestScore >= 25;
    }
    if (milestoneId === "reach_score_50") {
      return progress.bestScore >= 50 || stats.bestScore >= 50;
    }
    if (milestoneId === "complete_10_missions") {
      return stats.missionsCompleted >= 10;
    }
    if (milestoneId === "survive_25_sabotages") {
      return stats.sabotagesSurvivedTotal >= 25;
    }
    if (milestoneId === "earn_1000_total_coffee") {
      return stats.totalCoffeeEarned >= 1000;
    }
    if (milestoneId === "play_25_runs") {
      return stats.totalRuns >= 25;
    }
    return false;
  }

  function getMilestoneLabel(milestoneId) {
    const labels = {
      reach_score_25: "Score 25",
      reach_score_50: "Score 50",
      complete_10_missions: "10 Missionen",
      survive_25_sabotages: "25 Sabotagen",
      earn_1000_total_coffee: "1000 Kaffee verdient",
      play_25_runs: "25 Runs"
    };
    return labels[milestoneId] || "Meilenstein";
  }

  function isCharacterUnlocked(character, progress) {
    return character.unlock.type === "default" || progress.unlockedCharacters.includes(character.id);
  }

  function getCharacterRequirement(character, progress) {
    const unlock = character.unlock || { type: "default" };
    const missing = [];
    if (unlock.type === "default") {
      return { met: true, label: "Ausgewaehlt" };
    }
    if ((unlock.type === "coffee" || unlock.type === "coffee_and_milestone") && progress.coffee < unlock.amount) {
      missing.push(`${unlock.amount} Kaffee`);
    }
    if ((unlock.type === "milestone" || unlock.type === "coffee_and_milestone") && !isMilestoneMet(unlock.milestone, progress)) {
      missing.push(getMilestoneLabel(unlock.milestone));
    }
    return {
      met: missing.length === 0,
      label: missing.length ? `Benoetigt: ${missing.join(" + ")}` : character.priceCoffee > 0 ? `${character.priceCoffee} Kaffee` : "Freischalten"
    };
  }

  function canUnlockCharacter(character, progress) {
    return !isCharacterUnlocked(character, progress) && getCharacterRequirement(character, progress).met;
  }

  // OBSTACLES / OPPONENT CORE
  function findUpcomingPipeForOpponent(pipes, playerX, speed, rules, difficulty) {
    const reactionDistance = speed * Math.max(rules.minReactionTime, 0.6);
    const minX = playerX + Math.max(rules.safeDistanceFromPlayer, reactionDistance);
    const maxX = WORLD.width - PHYSICS.obstacleWidth * 0.25;
    return pipes.find((pipe) => {
      return pipe.x > minX && pipe.x < maxX && !pipe.wasManipulated && !pipe.scored;
    });
  }

  function clampGap(pipe, difficulty, config) {
    const minGap = Math.max(difficulty.minGapHeight, WORLD.height * config.relativeMinGap);
    pipe.gap = Math.max(pipe.gap, minGap);
    const halfGap = pipe.gap / 2;
    pipe.gapY = clamp(pipe.gapY, config.gapMargin + halfGap, PLAYABLE_HEIGHT - config.gapMargin - halfGap);
  }

  function mutatePipeGeometry(pipe, mutation, config, difficulty = getOpponentDifficulty(0)) {
    if (!pipe || pipe.wasManipulated) {
      return false;
    }

    const previousGapY = pipe.gapY;
    const previousGap = pipe.gap;

    if (mutation.type === "shift_gap") {
      const amount = clamp(mutation.amount, -difficulty.maxGapShift, difficulty.maxGapShift);
      const minY = pipe.gap / 2 + config.gapMargin;
      const maxY = PLAYABLE_HEIGHT - pipe.gap / 2 - config.gapMargin;
      pipe.gapY = clamp(pipe.gapY + amount, minY, maxY);
    }

    if (mutation.type === "shrink_gap") {
      pipe.gap *= mutation.factor || difficulty.gapShrinkFactor;
    }

    if (mutation.type === "reroll_gap") {
      pipe.gapY = clamp(mutation.gapY, pipe.gap / 2 + config.gapMargin, PLAYABLE_HEIGHT - pipe.gap / 2 - config.gapMargin);
    }

    if (mutation.type === "combo") {
      pipe.gapY += clamp(mutation.shiftAmount || 0, -difficulty.maxGapShift, difficulty.maxGapShift);
      pipe.gap *= mutation.factor || difficulty.gapShrinkFactor;
    }

    clampGap(pipe, difficulty, config);
    const changed = pipe.gapY !== previousGapY || pipe.gap !== previousGap;
    if (changed) {
      pipe.wasManipulated = true;
      pipe.sabotaged = true;
      pipe.highlightTime = FEEDBACK.pipeHighlightDuration;
      pipe.highlightStrength = mutation.highlightStrength || difficulty.tier;
    }
    return changed;
  }

  // GAMEPLAY CORE
  function updatePlayer(player, dt, physics, tuning) {
    player.velocity = clamp(player.velocity + physics.gravity * dt, tuning.minVelocity, physics.maxFallVelocity);
    player.y += player.velocity * dt;
    player.rotation = clamp(player.velocity / tuning.rotationDivisor, tuning.minRotation, tuning.maxRotation);
    player.flapPose = Math.max(0, player.flapPose - dt * tuning.flapPoseDecay);
  }

  function updateRunPacing(model, physics, tuning) {
    model.speed = clamp(physics.baseObstacleSpeed + model.score * tuning.speedPerScore, physics.baseObstacleSpeed, physics.maxObstacleSpeed);
    model.currentGap = clamp(physics.baseGap - model.score * tuning.gapTightenPerScore, physics.minGap, physics.baseGap);
  }

  function isPlayerPastObstacle(player, obstacle, physics) {
    return obstacle.x + physics.obstacleWidth < player.x - player.radius;
  }

  function circleIntersectsRect(circle, radius, x, y, width, height) {
    if (height <= 0) {
      return false;
    }
    const nearestX = clamp(circle.x, x, x + width);
    const nearestY = clamp(circle.y, y, y + height);
    const dx = circle.x - nearestX;
    const dy = circle.y - nearestY;
    return dx * dx + dy * dy < radius * radius;
  }

  function hitWorldBounds(player) {
    return player.y - player.radius < 0 || player.y + player.radius > PLAYABLE_HEIGHT;
  }

  function hitObstacle(player, obstacles, physics) {
    const radius = player.radius - 5;
    for (const obstacle of obstacles) {
      const topBottom = obstacle.gapY - obstacle.gap / 2;
      const bottomTop = obstacle.gapY + obstacle.gap / 2;
      if (circleIntersectsRect(player, radius, obstacle.x, 0, physics.obstacleWidth, topBottom)) {
        return true;
      }
      if (circleIntersectsRect(player, radius, obstacle.x, bottomTop, physics.obstacleWidth, PLAYABLE_HEIGHT - bottomTop)) {
        return true;
      }
    }
    return false;
  }

  function calculateRunRewards(model, mission) {
    const scoreCoffee = model.score * RUN_REWARDS.coffeePerScore;
    const sabotageCoffee = model.stats.sabotagesSurvived * RUN_REWARDS.coffeePerSabotage;
    const missionComplete = Boolean(mission && mission.isComplete({ model }));
    const missionCoffee = missionComplete ? mission.reward : 0;
    return {
      missionComplete,
      total: scoreCoffee + sabotageCoffee + missionCoffee
    };
  }

  // AUDIO
  class AudioManager {
    constructor() {
      this.context = null;
      this.enabled = true;
      this.unlocked = false;
      this.masterGain = null;
      this.sounds = {
        flap: [{ frequency: 540, duration: 0.045, type: "square", volume: 0.032 }],
        score: [
          { frequency: 820, duration: 0.06, type: "sine", volume: 0.04 },
          { frequency: 1040, duration: 0.055, type: "sine", volume: 0.032, offset: 0.045 }
        ],
        coffee: [{ frequency: 660, duration: 0.045, type: "triangle", volume: 0.026 }],
        mission: [
          { frequency: 760, duration: 0.06, type: "sine", volume: 0.035 },
          { frequency: 1160, duration: 0.075, type: "sine", volume: 0.032, offset: 0.055 }
        ],
        sabotage: [{ frequency: 210, duration: 0.09, type: "sawtooth", volume: 0.028 }],
        crash: [{ frequency: 130, duration: 0.16, type: "sawtooth", volume: 0.055 }],
        button: [{ frequency: 360, duration: 0.04, type: "triangle", volume: 0.026 }]
      };
    }

    unlock() {
      if (!this.enabled) {
        return;
      }
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        this.enabled = false;
        return;
      }
      if (!this.context) {
        try {
          this.context = new AudioContextClass({ latencyHint: "interactive" });
        } catch (_error) {
          this.context = new AudioContextClass();
        }
        this.masterGain = this.context.createGain();
        this.masterGain.gain.setValueAtTime(0.72, this.context.currentTime);
        this.masterGain.connect(this.context.destination);
      }
      if (this.context.state === "suspended") {
        this.context.resume().catch(() => {});
      }
      this.unlocked = true;
      this.playSilentWarmup();
    }

    playFlap() {
      this.play("flap");
    }

    playScore() {
      this.play("score");
    }

    playCoffee() {
      this.play("coffee");
    }

    playMission() {
      this.play("mission");
    }

    playSabotage() {
      this.play("sabotage");
    }

    playCrash() {
      this.play("crash");
    }

    playButton() {
      this.play("button");
    }

    play(name, volume = 1) {
      if (!this.context || !this.unlocked || this.context.state === "closed") {
        return;
      }
      const notes = this.sounds[name];
      if (!notes) {
        return;
      }
      const now = this.context.currentTime;
      for (const note of notes) {
        this.playTone(note.frequency, note.duration, note.type, note.volume * volume, now + (note.offset || 0));
      }
    }

    stopAll() {
      if (!this.masterGain || !this.context) {
        return;
      }
      this.masterGain.gain.cancelScheduledValues(this.context.currentTime);
      this.masterGain.gain.setValueAtTime(0.72, this.context.currentTime);
    }

    playSilentWarmup() {
      if (!this.context || !this.masterGain) {
        return;
      }
      this.playTone(20, 0.01, "sine", 0.0001, this.context.currentTime);
    }

    playTone(frequency, duration, type, volume, startTime) {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = startTime || this.context.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(this.masterGain);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    }
  }

  // OPPONENT
  class OpponentActionManager {
    constructor(rules) {
      this.rules = rules;
      this.reset();
    }

    reset() {
      this.cooldown = this.rules.initialCooldown;
      this.messageCooldown = 0;
      this.lastActionLabel = "";
      this.lastActionWasHard = false;
      this.lastDifficultyTier = 0;
      this.lastActionType = "";
    }

    update(dt, game) {
      this.messageCooldown = Math.max(0, this.messageCooldown - dt);
      this.announceDifficultyTier(game);

      const difficulty = getOpponentDifficulty(game.model.score);
      if (difficulty.actionChance <= 0) {
        return;
      }

      this.cooldown -= dt;
      if (this.cooldown > 0) {
        return;
      }

      this.scheduleAction(game, difficulty);
    }

    scheduleAction(game, difficulty) {
      if (Math.random() > difficulty.actionChance) {
        this.lastActionWasHard = false;
        this.cooldown = Math.max(1.0, difficulty.cooldown * 0.62);
        return;
      }

      const actionType = this.pickActionType(game.model.score, difficulty);
      if (!actionType) {
        this.lastActionWasHard = false;
        this.cooldown = Math.max(1.0, difficulty.cooldown * 0.55);
        return;
      }

      const target = this.findTargetObstacle(game, difficulty);
      if (!target) {
        this.cooldown = 0.15;
        return;
      }

      if (actionType === "combo" && this.applyCombo(game, target, difficulty)) {
        this.finishAction(game, "Combo", true, game.opponent.actionTexts.shrink, difficulty, true);
      } else if (actionType === "reroll" && this.applyReroll(game, target, difficulty)) {
        this.finishAction(game, "Reroll", true, game.opponent.actionTexts.shift, difficulty, false);
      } else if (actionType === "gapShift" && this.applyGapShift(game, target, difficulty)) {
        this.finishAction(game, "Gap Shift", true, game.opponent.actionTexts.shift, difficulty, false);
      } else if (actionType === "gapShrink" && this.applyGapShrink(game, target, difficulty)) {
        this.finishAction(game, "Gap Shrink", true, game.opponent.actionTexts.shrink, difficulty, false);
      } else {
        this.cooldown = Math.max(0.6, difficulty.cooldown * 0.35);
      }
    }

    pickActionType(score, difficulty) {
      const roll = Math.random();

      if (this.lastActionWasHard) {
        return null;
      }

      if (difficulty.maxComboActions > 1 && this.lastActionType !== "combo" && roll < this.rules.comboChance) {
        return "combo";
      }

      if (difficulty.tier >= 2 && roll < this.rules.comboChance + this.rules.rerollChance) {
        return "reroll";
      }

      if (difficulty.tier >= 1 && this.lastActionType !== "gapShrink" && roll > 0.62) {
        return "gapShrink";
      }

      return "gapShift";
    }

    applyGapShift(game, obstacle, difficulty) {
      const amount = randomBetween(-difficulty.maxGapShift, difficulty.maxGapShift);
      return mutatePipeGeometry(obstacle, { type: "shift_gap", amount, highlightStrength: difficulty.tier }, this.rules, difficulty);
    }

    applyGapShrink(game, obstacle, difficulty) {
      return mutatePipeGeometry(obstacle, { type: "shrink_gap", factor: difficulty.gapShrinkFactor, highlightStrength: difficulty.tier + 1 }, this.rules, difficulty);
    }

    applyReroll(game, obstacle, difficulty) {
      const halfGap = obstacle.gap / 2;
      const gapY = randomBetween(this.rules.gapMargin + halfGap, PLAYABLE_HEIGHT - this.rules.gapMargin - halfGap);
      return mutatePipeGeometry(obstacle, { type: "reroll_gap", gapY, highlightStrength: difficulty.tier + 1 }, this.rules, difficulty);
    }

    applyCombo(game, obstacle, difficulty) {
      const shiftAmount = randomBetween(-difficulty.maxGapShift * 0.8, difficulty.maxGapShift * 0.8);
      const factor = Math.max(difficulty.gapShrinkFactor, 0.88);
      return mutatePipeGeometry(obstacle, { type: "combo", shiftAmount, factor, highlightStrength: difficulty.tier + 2 }, this.rules, difficulty);
    }

    finishAction(game, label, isHard, taunt, difficulty, isCombo) {
      this.lastActionLabel = label;
      this.lastActionWasHard = isHard;
      this.lastActionType = label === "Gap Shrink" ? "gapShrink" : label === "Combo" ? "combo" : label;
      this.cooldown = difficulty.cooldown * (isCombo ? 1.35 : 1);
      game.model.lastOpponentAction = label;
      game.audio.playSabotage();
      if (taunt && this.messageCooldown <= 0) {
        game.addFloatingText(taunt, WORLD.width - 78, 178, 0.92);
        this.messageCooldown = this.rules.messageCooldown;
      }
    }

    findTargetObstacle(game, difficulty) {
      return findUpcomingPipeForOpponent(
        game.model.obstacles,
        game.model.player.x,
        game.model.speed,
        this.rules,
        difficulty
      );
    }

    isObstacleSafe(game, obstacle) {
      const distance = obstacle.x - game.model.player.x;
      return !obstacle.scored && distance > this.rules.safeDistanceFromPlayer;
    }

    announceDifficultyTier(game) {
      const difficulty = getOpponentDifficulty(game.model.score);
      if (difficulty.tier <= this.lastDifficultyTier || !difficulty.tierMessage) {
        return;
      }

      this.lastDifficultyTier = difficulty.tier;
      game.addFloatingText(difficulty.tierMessage, WORLD.width / 2, 138, 0.95);
    }
  }

  // RENDERING
  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    }

    resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(WORLD.width * ratio);
      this.canvas.height = Math.round(WORLD.height * ratio);
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    draw(model) {
      this.ctx.save();
      if (model.screenShake && model.screenShake.time > 0) {
        const shake = model.screenShake.intensity * (model.screenShake.time / model.screenShake.duration);
        this.ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      }
      this.drawSky();
      this.drawClouds(model.clouds);
      this.drawOpponent(model.opponent, model.distance);
      this.drawObstacles(model.obstacles);
      this.drawGround(model.distance, model.reducedMotion);
      this.drawPlayer(model.player, model.skin);
      this.drawParticles(model.particles);
      this.drawFloatingTexts(model.floatingTexts);
      this.drawFeedbackTexts(model.feedbackTexts);
      this.ctx.restore();
    }

    drawSky() {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, WORLD.height);
      gradient.addColorStop(0, "#79c7e8");
      gradient.addColorStop(0.62, "#c7ebdf");
      gradient.addColorStop(1, "#efe0a3");
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, WORLD.width, WORLD.height);
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let y = 92; y < PLAYABLE_HEIGHT; y += 112) {
        this.ctx.fillRect(0, y, WORLD.width, 2);
      }
    }

    drawClouds(clouds) {
      this.ctx.save();
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
      for (const cloud of clouds) {
        this.ctx.save();
        this.ctx.translate(cloud.x, cloud.y);
        this.ctx.scale(cloud.scale, cloud.scale);
        this.ctx.beginPath();
        this.ctx.arc(0, 22, 22, Math.PI, Math.PI * 2);
        this.ctx.arc(26, 12, 28, Math.PI, Math.PI * 2);
        this.ctx.arc(58, 24, 20, Math.PI, Math.PI * 2);
        this.ctx.rect(-24, 22, 102, 28);
        this.ctx.fill();
        this.ctx.restore();
      }
      this.ctx.restore();
    }

    drawOpponent(opponent, distance) {
      if (!opponent) {
        return;
      }

      const bob = Math.sin(distance * 0.018) * 5;
      const x = WORLD.width - 54;
      const y = 116 + bob;
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = 0.97;
      ctx.shadowColor = "rgba(23, 38, 47, 0.22)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = "rgba(255, 253, 242, 0.96)";
      ctx.strokeStyle = "#a8322d";
      ctx.lineWidth = 3;
      this.roundedRect(x - 40, y - 35, 80, 66, 10);
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "#a8322d";
      this.roundedRect(x - 30, y + 18, 60, 16, 5);
      ctx.fill();

      ctx.fillStyle = "#efe2cf";
      ctx.beginPath();
      ctx.arc(x, y - 8, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f3f4ee";
      ctx.beginPath();
      ctx.arc(x - 10, y - 23, 8, Math.PI, Math.PI * 2);
      ctx.arc(x + 3, y - 26, 10, Math.PI, Math.PI * 2);
      ctx.arc(x + 15, y - 21, 7, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#17262f";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(x - 12, y - 11, 9, 7);
      ctx.rect(x + 4, y - 11, 9, 7);
      ctx.moveTo(x - 2, y - 6);
      ctx.lineTo(x + 4, y - 6);
      ctx.stroke();

      ctx.fillStyle = "#fff7df";
      ctx.font = "900 9px ui-rounded, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PROF", x, y + 30);
      ctx.restore();
    }

    drawObstacles(obstacles) {
      for (const obstacle of obstacles) {
        const topHeight = obstacle.gapY - obstacle.gap / 2;
        const bottomY = obstacle.gapY + obstacle.gap / 2;
        this.drawObstacleStack(obstacle.x, 0, topHeight, obstacle.type, true);
        this.drawObstacleStack(obstacle.x, bottomY, PLAYABLE_HEIGHT - bottomY, obstacle.type, false);
        this.drawObstacleHighlight(obstacle, topHeight, bottomY);
      }
    }

    drawObstacleHighlight(obstacle, topHeight, bottomY) {
      if (!obstacle.highlightTime || obstacle.highlightTime <= 0) {
        return;
      }

      const pulse = clamp(obstacle.highlightTime / FEEDBACK.pipeHighlightDuration, 0, 1);
      const strength = clamp((obstacle.highlightStrength || 1) / 5, 0.2, 1);
      const alpha = 0.12 + pulse * (0.32 + strength * 0.32);
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = strength > 0.72 ? "#ffd166" : "#fff2a8";
      ctx.lineWidth = 3 + strength * 3;
      ctx.setLineDash(strength > 0.72 ? [5, 5] : [8, 7]);
      ctx.strokeRect(obstacle.x - 4, Math.max(4, topHeight - 12), PHYSICS.obstacleWidth + 8, 24);
      ctx.strokeRect(obstacle.x - 4, bottomY - 12, PHYSICS.obstacleWidth + 8, 24);
      ctx.setLineDash([]);
      ctx.fillStyle = "#fff2a8";
      ctx.strokeStyle = "rgba(20, 63, 44, 0.42)";
      ctx.lineWidth = 3;
      ctx.font = "900 18px ui-rounded, system-ui, sans-serif";
      ctx.textAlign = "center";
      const labelY = clamp(obstacle.gapY, 70, PLAYABLE_HEIGHT - 70);
      ctx.strokeText("!", obstacle.x + PHYSICS.obstacleWidth / 2, labelY + 6);
      ctx.fillText("!", obstacle.x + PHYSICS.obstacleWidth / 2, labelY + 6);
      ctx.restore();
    }

    drawObstacleStack(x, y, height, type, flipped) {
      if (height <= 0) {
        return;
      }
      const pipeWidth = PHYSICS.obstacleWidth;
      const capHeight = Math.min(30, height);
      const capY = flipped ? y + height - capHeight : y;
      const bodyY = flipped ? y : y + capHeight;
      const bodyHeight = Math.max(0, height - capHeight);
      const bodyX = x + 7;
      const bodyWidth = pipeWidth - 14;
      const bodyGradient = this.ctx.createLinearGradient(bodyX, 0, bodyX + bodyWidth, 0);
      bodyGradient.addColorStop(0, "#246c43");
      bodyGradient.addColorStop(0.18, "#5dbb67");
      bodyGradient.addColorStop(0.56, "#3f9b58");
      bodyGradient.addColorStop(1, "#1d5638");
      const capGradient = this.ctx.createLinearGradient(x, 0, x + pipeWidth, 0);
      capGradient.addColorStop(0, "#1f5d3a");
      capGradient.addColorStop(0.2, "#6ccf75");
      capGradient.addColorStop(0.6, "#44a85e");
      capGradient.addColorStop(1, "#184b31");

      this.ctx.save();
      if (bodyHeight > 0) {
        this.ctx.fillStyle = bodyGradient;
        this.ctx.fillRect(bodyX, bodyY, bodyWidth, bodyHeight);
        this.ctx.strokeStyle = "#163f2b";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bodyX, bodyY, bodyWidth, bodyHeight);
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        this.ctx.fillRect(bodyX + 8, bodyY, 7, bodyHeight);
      }
      this.ctx.fillStyle = capGradient;
      this.roundedRect(x, capY, pipeWidth, capHeight, 5);
      this.ctx.fill();
      this.ctx.strokeStyle = "#133725";
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.ctx.fillRect(x + 10, capY + 4, 8, Math.max(0, capHeight - 8));
      this.ctx.restore();
    }

    drawGround(distance, reducedMotion) {
      this.ctx.fillStyle = "#d9a84d";
      this.ctx.fillRect(0, PLAYABLE_HEIGHT, WORLD.width, WORLD.ground);
      this.ctx.fillStyle = "#638d60";
      this.ctx.fillRect(0, PLAYABLE_HEIGHT, WORLD.width, 18);
      const offset = reducedMotion ? 0 : -(distance % 36);
      for (let x = offset; x < WORLD.width + 36; x += 36) {
        this.ctx.fillStyle = "#486f4c";
        this.ctx.fillRect(x, PLAYABLE_HEIGHT + 6, 24, 5);
        this.ctx.fillStyle = "rgba(120, 77, 35, 0.2)";
        this.ctx.fillRect(x + 8, PLAYABLE_HEIGHT + 34, 28, 5);
      }
    }

    drawPlayer(player, skin) {
      const ctx = this.ctx;
      const primary = skin.colorPrimary || skin.hoodie;
      const secondary = skin.colorSecondary || "rgba(255, 255, 255, 0.35)";
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.rotation);
      const flapOffset = Math.sin((1 - player.flapPose) * Math.PI) * 7;
      this.drawCharacterTrail(skin, flapOffset);
      ctx.strokeStyle = "rgba(22, 49, 61, 0.42)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-18, 11);
      ctx.lineTo(-34, 23 + flapOffset);
      ctx.moveTo(12, 12);
      ctx.lineTo(28, 25 - flapOffset);
      ctx.stroke();
      ctx.fillStyle = primary;
      ctx.beginPath();
      if (skin.shape === "ghost") {
        ctx.globalAlpha = 0.84;
        ctx.ellipse(-2, 10, 18, 22, -0.08, 0, Math.PI * 2);
      } else if (skin.shape === "berserker") {
        ctx.rect(-20, -5, 34, 34);
      } else {
        ctx.ellipse(-2, 11, 18, 20, -0.08, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#17394c";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      this.drawCharacterBodyDetails(skin, secondary);
      ctx.fillStyle = "#f3bf8f";
      ctx.strokeStyle = "#5d372b";
      ctx.beginPath();
      ctx.arc(1, -13, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = skin.hair;
      ctx.beginPath();
      ctx.arc(-6, -25, 7, Math.PI * 0.92, Math.PI * 1.95);
      ctx.arc(5, -27, 9, Math.PI * 0.98, Math.PI * 1.98);
      ctx.arc(15, -22, 5, Math.PI * 1.04, Math.PI * 1.92);
      ctx.fill();
      this.drawCharacterHeadDetails(skin, secondary);
      this.drawGlasses();
      ctx.fillStyle = "#101820";
      ctx.fillRect(-7, -12, 2, 2);
      ctx.fillRect(8, -12, 2, 2);
      ctx.strokeStyle = "#8a4a36";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(2, -5, 5, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.fillStyle = skin.laptop;
      ctx.strokeStyle = "#101820";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(12, 6);
      ctx.lineTo(35, 2);
      ctx.lineTo(36, 19);
      ctx.lineTo(12, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#95d8ef";
      ctx.font = "900 8px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText("</>", 24, 15);
      ctx.restore();
    }

    drawCharacterTrail(skin, flapOffset) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = 0.58;
      ctx.strokeStyle = skin.colorSecondary || "rgba(255, 255, 255, 0.5)";
      ctx.lineWidth = 2;
      if (skin.trail === "coffee") {
        ctx.fillStyle = "#6f4a2f";
        ctx.fillText("☕", -39, 10);
      } else if (skin.trail === "zzz") {
        ctx.fillStyle = "#64748b";
        ctx.font = "900 10px ui-rounded, system-ui, sans-serif";
        ctx.fillText("Z", -38, -8);
      } else if (skin.trail === "mist") {
        ctx.beginPath();
        ctx.arc(-34, 10, 7, 0, Math.PI * 2);
        ctx.arc(-47, 20, 5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (skin.trail === "sparks" || skin.trail === "fire") {
        ctx.fillStyle = skin.trail === "fire" ? "#fb923c" : "#facc15";
        ctx.fillText("*", -36, 14 + flapOffset * 0.2);
      } else if (skin.trail === "crumbs") {
        ctx.fillStyle = "#d9a066";
        ctx.fillRect(-38, 8, 3, 3);
        ctx.fillRect(-48, 18, 2, 2);
      }
      ctx.restore();
    }

    drawCharacterBodyDetails(skin, secondary) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = secondary;
      ctx.strokeStyle = "rgba(23, 38, 47, 0.3)";
      ctx.lineWidth = 1.5;
      if (skin.shape === "duck") {
        ctx.beginPath();
        ctx.moveTo(15, 2);
        ctx.lineTo(28, 6);
        ctx.lineTo(15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (skin.shape === "bird") {
        ctx.beginPath();
        ctx.moveTo(-16, 5);
        ctx.lineTo(-31, 0);
        ctx.lineTo(-23, 12);
        ctx.moveTo(-14, 15);
        ctx.lineTo(-30, 20);
        ctx.lineTo(-18, 25);
        ctx.stroke();
      } else if (skin.shape === "ghost") {
        ctx.beginPath();
        ctx.arc(-12, 30, 5, Math.PI, 0);
        ctx.arc(0, 30, 5, Math.PI, 0);
        ctx.arc(12, 30, 5, Math.PI, 0);
        ctx.stroke();
      } else if (skin.shape === "dragon") {
        ctx.beginPath();
        ctx.moveTo(-17, 1);
        ctx.lineTo(-30, -8);
        ctx.lineTo(-24, 7);
        ctx.closePath();
        ctx.fill();
      } else if (skin.shape === "seagull") {
        ctx.beginPath();
        ctx.moveTo(-18, 8);
        ctx.quadraticCurveTo(-38, 0, -45, 16);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawCharacterHeadDetails(skin, secondary) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = secondary;
      ctx.strokeStyle = "#5d372b";
      ctx.lineWidth = 1.5;
      if (skin.shape === "goblin") {
        ctx.beginPath();
        ctx.moveTo(-14, -15);
        ctx.lineTo(-25, -18);
        ctx.lineTo(-15, -8);
        ctx.moveTo(16, -15);
        ctx.lineTo(27, -18);
        ctx.lineTo(17, -8);
        ctx.stroke();
      } else if (skin.shape === "berserker") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(-13, -23, 28, 5);
      } else if (skin.shape === "dragon") {
        ctx.beginPath();
        ctx.moveTo(-8, -28);
        ctx.lineTo(-3, -38);
        ctx.lineTo(2, -28);
        ctx.moveTo(8, -27);
        ctx.lineTo(13, -36);
        ctx.lineTo(17, -25);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawGlasses() {
      this.ctx.strokeStyle = "#101820";
      this.ctx.lineWidth = 2.2;
      this.ctx.beginPath();
      this.ctx.rect(-11, -15, 10, 7);
      this.ctx.rect(4, -15, 10, 7);
      this.ctx.moveTo(-1, -12);
      this.ctx.lineTo(4, -12);
      this.ctx.stroke();
    }

    drawParticles(particles) {
      for (const particle of particles) {
        this.ctx.save();
        this.ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    drawFloatingTexts(texts) {
      for (const item of texts) {
        this.ctx.save();
        this.ctx.globalAlpha = clamp(item.life / item.maxLife, 0, 1);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "rgba(22, 49, 61, 0.45)";
        this.ctx.lineWidth = 4;
        this.ctx.font = "900 18px ui-rounded, system-ui, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.strokeText(item.text, item.x, item.y);
        this.ctx.fillText(item.text, item.x, item.y);
        this.ctx.restore();
      }
    }

    drawFeedbackTexts(texts) {
      for (const item of texts) {
        const progress = clamp(item.age / item.duration, 0, 1);
        const pop = 1 + Math.sin(progress * Math.PI) * 0.12;
        this.ctx.save();
        this.ctx.globalAlpha = 1 - progress;
        this.ctx.translate(item.x, item.y);
        this.ctx.scale(pop, pop);
        this.ctx.fillStyle = item.color || "#143f2c";
        this.ctx.strokeStyle = "rgba(246, 255, 244, 0.88)";
        this.ctx.lineWidth = 4;
        this.ctx.font = "900 17px ui-rounded, system-ui, sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.strokeText(item.text, 0, 0);
        this.ctx.fillText(item.text, 0, 0);
        this.ctx.restore();
      }
    }

    roundedRect(x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      this.ctx.beginPath();
      this.ctx.moveTo(x + r, y);
      this.ctx.lineTo(x + width - r, y);
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      this.ctx.lineTo(x + width, y + height - r);
      this.ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      this.ctx.lineTo(x + r, y + height);
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      this.ctx.lineTo(x, y + r);
      this.ctx.quadraticCurveTo(x, y, x + r, y);
      this.ctx.closePath();
    }
  }

  // GAME STATE / INPUT / UPDATE LOOP / UI
  class Game {
    constructor(elements) {
      this.elements = elements;
      this.audio = new AudioManager();
      this.renderer = new Renderer(elements.canvas);
      this.progress = loadProgress();
      this.bestScore = this.progress.bestScore;
      this.coffee = this.progress.coffee;
      this.selectedSkinId = this.progress.selectedCharacterId;
      this.characterIndex = Math.max(0, THEME.skins.findIndex((skin) => skin.id === this.selectedSkinId));
      this.characterMessage = "";
      this.selectedOpponentId = readStorage(STORAGE_KEYS.selectedOpponent, "profDeadline");
      this.customOpponentName = readStorage(STORAGE_KEYS.customOpponentName, "");
      this.opponent = this.getSelectedOpponent();
      writeStorage(STORAGE_KEYS.selectedOpponent, this.opponent.id);
      this.opponentActions = new OpponentActionManager(OPPONENT_RULES);
      this.dailyGoal = 6 + (todaySeed() % 7);
      this.state = GAME_STATE.START;
      this.lastTime = 0;
      this.accumulator = 0;
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.model = this.createModel();
    }

    init() {
      this.renderer.resize();
      this.bindInput();
      this.syncUi();
      this.showStart();
      window.addEventListener("resize", () => {
        this.renderer.resize();
        this.render();
      });
      requestAnimationFrame((time) => this.frame(time));
    }

    bindInput() {
      this.elements.canvas.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.action();
      });
      this.elements.primaryButton.addEventListener("click", () => this.action());
      this.elements.menuButton.addEventListener("click", () => this.returnToMenu());
      this.elements.pauseButton.addEventListener("click", () => this.togglePause());
      this.elements.howToButton.addEventListener("click", () => this.showHowTo());
      window.addEventListener("keydown", (event) => {
        if (event.repeat) {
          return;
        }
        if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
          event.preventDefault();
          this.action();
        }
        if (event.code === "Escape" || event.code === "KeyP") {
          event.preventDefault();
          this.togglePause();
        }
      });
      window.addEventListener("blur", () => {
        if (this.state === GAME_STATE.PLAYING) {
          this.pause();
        }
      });
    }

    action() {
      this.audio.unlock();
      this.audio.playButton();
      if (this.state === GAME_STATE.HOW_TO) {
        this.state = GAME_STATE.START;
        this.showStart();
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

    startRun() {
      this.resetRun(this.pickRunMission());
      this.state = GAME_STATE.PLAYING;
      this.lastTime = performance.now();
      this.elements.overlay.hidden = true;
      this.syncUi();
      this.flap();
    }

    pause() {
      this.state = GAME_STATE.PAUSED;
      this.syncUi();
      this.showOverlay("", "Pause", "", "Weiter", true, true, true, "Hauptmenü");
    }

    resume() {
      this.state = GAME_STATE.PLAYING;
      this.lastTime = performance.now();
      this.elements.overlay.hidden = true;
      this.syncUi();
    }

    togglePause() {
      if (this.state === GAME_STATE.PLAYING) {
        this.pause();
      } else if (this.state === GAME_STATE.PAUSED) {
        this.resume();
      }
    }

    showHowTo() {
      if (this.state === GAME_STATE.PLAYING) {
        this.pause();
      }
      this.state = GAME_STATE.HOW_TO;
      this.syncUi();
      this.showOverlay("Tippen oder Space", "So geht's", THEME.howTo, "Los", true, true, false, "");
    }

    showStart() {
      this.syncUi();
      this.showOverlay(`★ Best: ${this.bestScore}   ☕ Kaffee: ${this.coffee}`, THEME.title, `${THEME.subtitle}\nNeuer Run = neue Mission.`, "Spielen", false, true, false, "");
    }

    showGameOver(comment) {
      const missionLine = this.model.missionComplete ? "Mission: geschafft" : "Mission: verpasst";
      this.showOverlay(
        `★ Score: ${this.model.score} | Best: ${this.bestScore}`,
        "Exmatrikuliert.",
        `${missionLine}\n☕ Kaffee: +${this.model.stats.coffeeEarnedThisRun}\nGesamt: ${this.coffee}`,
        "Nochmal",
        true,
        true,
        true,
        "Menü"
      );
    }

    showOverlay(eyebrow, title, text, button, hideSkins, hideHelp, showMenu, menuText) {
      this.elements.eyebrowText.textContent = eyebrow;
      this.elements.eyebrowText.hidden = !eyebrow;
      this.elements.titleText.textContent = title;
      this.elements.overlayText.textContent = text;
      this.elements.overlayText.hidden = !text;
      this.elements.primaryButton.textContent = button;
      this.elements.skinChooser.hidden = hideSkins;
      this.elements.howToButton.hidden = hideHelp;
      this.elements.menuButton.hidden = !showMenu;
      this.elements.menuButton.textContent = menuText;
      this.elements.overlay.hidden = false;
    }

    returnToMenu() {
      this.resetRun();
      this.state = GAME_STATE.START;
      this.accumulator = 0;
      this.lastTime = performance.now();
      this.syncUi();
      this.showStart();
    }

    flap() {
      this.model.player.velocity = PHYSICS.flapVelocity;
      this.model.player.flapPose = 1;
      this.audio.playFlap();
    }

    frame(time) {
      const rawDt = this.lastTime ? (time - this.lastTime) / 1000 : 0;
      this.lastTime = time;
      this.accumulator += Math.min(rawDt, GAME_TIMING.maxFrameDelta);
      while (this.accumulator >= GAME_TIMING.fixedStep) {
        this.update(GAME_TIMING.fixedStep);
        this.accumulator -= GAME_TIMING.fixedStep;
      }
      this.render();
      requestAnimationFrame((nextTime) => this.frame(nextTime));
    }

    update(dt) {
      this.updateEffects(dt);
      if (this.state !== GAME_STATE.PLAYING) {
        return;
      }
      this.model.stats.runSeconds += dt;
      this.checkMissionFeedback();
      this.model.missionUiTimer -= dt;
      if (this.model.missionUiTimer <= 0) {
        this.model.missionUiTimer = GAME_TIMING.missionUiRefresh;
        this.syncUi();
      }
      this.model.distance += this.model.speed * dt;
      updateRunPacing(this.model, PHYSICS, OBSTACLE_TUNING);
      const player = this.model.player;
      updatePlayer(player, dt, PHYSICS, PLAYER_TUNING);
      this.opponentActions.update(dt, this);

      for (const obstacle of this.model.obstacles) {
        obstacle.x -= this.model.speed * dt;
        obstacle.highlightTime = Math.max(0, (obstacle.highlightTime || 0) - dt);
        if (!obstacle.scored && isPlayerPastObstacle(player, obstacle, PHYSICS)) {
          obstacle.scored = true;
          this.model.score += 1;
          this.model.stats.pipesPassed += 1;
          this.addFeedbackText("+1", player.x + 36, player.y - 34, FEEDBACK.textDuration, "#ffffff");
          this.addFeedbackText(`☕ +${RUN_REWARDS.coffeePerScore}`, WORLD.width - 62, 86, FEEDBACK.textDuration, "#143f2c");
          this.audio.playCoffee();
          if (obstacle.sabotaged && !obstacle.sabotageRewarded) {
            obstacle.sabotageRewarded = true;
            this.model.stats.sabotagesSurvived += 1;
            this.addFeedbackText("Sabotage ueberlebt!", player.x + 56, player.y - 58, FEEDBACK.missionDuration, "#fff2a8");
            this.addFeedbackText(`☕ +${RUN_REWARDS.coffeePerSabotage}`, WORLD.width - 62, 112, FEEDBACK.textDuration, "#143f2c");
          }
          this.audio.playScore();
          this.spawnScoreEffects();
          this.maybeSpawnOpponentTaunt();
          this.checkMissionFeedback();
          this.syncUi();
        }
      }
      while (this.model.obstacles.length && this.model.obstacles[0].x + PHYSICS.obstacleWidth < -OBSTACLE_TUNING.despawnPadding) {
        this.model.obstacles.shift();
      }
      const last = this.model.obstacles[this.model.obstacles.length - 1];
      if (last && last.x < WORLD.width - PHYSICS.spacing) {
        this.addObstacle(last.x + PHYSICS.spacing);
      }
      for (const cloud of this.model.clouds) {
        cloud.x -= cloud.speed * dt;
        if (cloud.x < OBSTACLE_TUNING.cloudDespawnX) {
          cloud.x = WORLD.width + OBSTACLE_TUNING.cloudResetX;
        }
      }
      if (hitWorldBounds(player) || hitObstacle(player, this.model.obstacles, PHYSICS)) {
        this.endRun();
      }
    }

    updateEffects(dt) {
      if (this.model.screenShake.time > 0) {
        this.model.screenShake.time = Math.max(0, this.model.screenShake.time - dt);
      }
      this.model.particles = this.model.particles
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx * dt,
          y: particle.y + particle.vy * dt,
          vy: particle.vy + EFFECT_TUNING.particleGravity * dt,
          life: particle.life - dt
        }))
        .filter((particle) => particle.life > 0);
      this.model.floatingTexts = this.model.floatingTexts
        .map((item) => ({ ...item, y: item.y - EFFECT_TUNING.floatingTextSpeed * dt, life: item.life - dt }))
        .filter((item) => item.life > 0);
      this.model.feedbackTexts = this.model.feedbackTexts
        .map((item) => ({ ...item, age: item.age + dt, y: item.y - EFFECT_TUNING.feedbackTextSpeed * dt }))
        .filter((item) => item.age < item.duration);
    }

    endRun() {
      if (this.state === GAME_STATE.GAME_OVER) {
        return;
      }
      this.state = GAME_STATE.GAME_OVER;
      this.audio.playCrash();
      this.triggerScreenShake(FEEDBACK.crashShakeDuration, FEEDBACK.crashShakeIntensity);
      this.spawnCrashEffects();
      this.finishRunRewards();
      if (this.model.score > this.bestScore) {
        this.bestScore = this.model.score;
      }
      this.progress.bestScore = this.bestScore;
      this.progress.coffee = this.coffee;
      this.updateProgressStatsAfterRun();
      saveProgress(this.progress);
      this.syncUi();
      this.showGameOver(choose(THEME.comments, this.model.score + Math.floor(this.model.distance)));
    }

    pickRunMission() {
      return choose(RUN_MISSIONS, Math.floor(Math.random() * RUN_MISSIONS.length));
    }

    finishRunRewards() {
      if (this.model.rewardsPaid) {
        return;
      }

      const rewards = calculateRunRewards(this.model, this.model.mission);
      this.model.missionComplete = rewards.missionComplete;
      this.model.stats.coffeeEarnedThisRun = rewards.total;
      this.coffee += this.model.stats.coffeeEarnedThisRun;
      this.model.rewardsPaid = true;
    }

    updateProgressStatsAfterRun() {
      const stats = this.progress.stats || defaultProgressStats(this.bestScore);
      stats.bestScore = Math.max(stats.bestScore || 0, this.bestScore);
      stats.totalRuns += 1;
      if (this.model.missionComplete) {
        stats.missionsCompleted += 1;
      }
      stats.sabotagesSurvivedTotal += this.model.stats.sabotagesSurvived;
      stats.totalCoffeeEarned += this.model.stats.coffeeEarnedThisRun;
      this.progress.stats = stats;
    }

    resetRun(mission = null) {
      this.model = this.createModel(mission);
      this.opponentActions.reset();
    }

    getMissionProgressText() {
      if (!this.model.mission) {
        return "-";
      }

      return this.model.mission.progress(this);
    }

    getLiveCoffeeThisRun() {
      if (this.model.rewardsPaid) {
        return this.model.stats.coffeeEarnedThisRun;
      }

      return (this.model.score * RUN_REWARDS.coffeePerScore)
        + (this.model.stats.sabotagesSurvived * RUN_REWARDS.coffeePerSabotage);
    }

    checkMissionFeedback() {
      if (!this.model.mission || this.model.missionNotified || !this.model.mission.isComplete(this)) {
        return;
      }

      this.model.missionNotified = true;
      this.addFeedbackText("Mission geschafft!", WORLD.width / 2, 154, FEEDBACK.missionDuration, "#fff2a8");
      this.addFeedbackText(`☕ +${this.model.mission.reward} Mission`, WORLD.width / 2, 184, FEEDBACK.missionDuration, "#143f2c");
      this.audio.playMission();
    }

    addFeedbackText(text, x, y, duration = FEEDBACK.textDuration, color = "#143f2c") {
      this.model.feedbackTexts.push({
        text,
        x,
        y,
        age: 0,
        duration,
        color
      });
      if (this.model.feedbackTexts.length > FEEDBACK.maxTexts) {
        this.model.feedbackTexts.splice(0, this.model.feedbackTexts.length - FEEDBACK.maxTexts);
      }
    }

    triggerScreenShake(duration, intensity) {
      this.model.screenShake.time = duration;
      this.model.screenShake.duration = duration;
      this.model.screenShake.intensity = intensity;
    }

    createModel(mission = null) {
      const model = {
        score: 0,
        distance: 0,
        speed: PHYSICS.baseObstacleSpeed,
        currentGap: PHYSICS.baseGap,
        player: { x: WORLD.playerStart.x, y: WORLD.playerStart.y, radius: 19, velocity: 0, rotation: 0, flapPose: 0 },
        obstacles: [],
        particles: [],
        floatingTexts: [],
        feedbackTexts: [],
        opponent: this.opponent,
        mission,
        missionComplete: false,
        missionNotified: false,
        nextOpponentTauntScore: 10,
        lastOpponentAction: "",
        stats: {
          sabotagesSurvived: 0,
          pipesPassed: 0,
          runSeconds: 0,
          coffeeEarnedThisRun: 0
        },
        missionUiTimer: 0,
        rewardsPaid: false,
        screenShake: {
          time: 0,
          duration: 0,
          intensity: 0
        },
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
        id: `obstacle-${index}`,
        x,
        gapY: this.nextGapY(index),
        gap: this.model.currentGap,
        type: choose(THEME.obstacles, index),
        scored: false,
        wasManipulated: false,
        sabotaged: false,
        sabotageRewarded: false
      });
    }

    nextGapY(index) {
      const wave = Math.sin(index * 1.12 + todaySeed() * 0.001) * 82;
      const ripple = Math.sin(index * 2.24 + 0.8) * 34;
      return clamp(278 + wave + ripple, 182, PLAYABLE_HEIGHT - 174);
    }

    spawnScoreEffects() {
      const player = this.model.player;
      if (this.model.score % 4 === 0) {
        this.model.floatingTexts.push({ text: choose(THEME.scoreBursts, this.model.score), x: player.x + 38, y: player.y - 22, life: 0.7, maxLife: 0.7 });
      }
      for (let i = 0; i < 10; i += 1) {
        this.model.particles.push({ x: player.x + 24, y: player.y, vx: 80 + Math.random() * 120, vy: -130 + Math.random() * 190, size: 2 + Math.random() * 3, color: i % 2 ? "#f4d35e" : "#ffffff", life: 0.45, maxLife: 0.45 });
      }
      this.capEffects();
    }

    maybeSpawnOpponentTaunt() {
      if (this.model.score < this.model.nextOpponentTauntScore) {
        return;
      }

      this.model.nextOpponentTauntScore += 9;
      this.model.floatingTexts.push({
        text: choose(this.opponent.shortTaunts, this.model.score),
        x: WORLD.width - 62,
        y: 168,
        life: 1.05,
        maxLife: 1.05
      });
      this.capEffects();
    }

    addFloatingText(text, x, y, life) {
      this.model.floatingTexts.push({
        text,
        x,
        y,
        life,
        maxLife: life
      });
      this.capEffects();
    }

    spawnCrashEffects() {
      const player = this.model.player;
      for (let i = 0; i < 28; i += 1) {
        const angle = (Math.PI * 2 * i) / 28;
        const speed = 90 + Math.random() * 210;
        this.model.particles.push({ x: player.x, y: player.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: 3 + Math.random() * 4, color: i % 3 === 0 ? "#d94d3d" : "#f4d35e", life: 0.75, maxLife: 0.75 });
      }
      this.capEffects();
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
      this.elements.toolbar.hidden = this.state !== GAME_STATE.PLAYING;
      this.elements.scoreText.textContent = `★ ${this.model.score}`;
      this.elements.bestText.textContent = String(this.bestScore);
      this.elements.goalLabel.textContent = this.model.mission ? this.model.mission.shortText : "Ziel";
      this.elements.goalText.textContent = this.getMissionProgressText();
      this.elements.coffeeText.textContent = `☕ +${this.getLiveCoffeeThisRun()}`;
      this.elements.missionText.textContent = this.model.mission
        ? `Mission: ${this.model.mission.text}`
        : "Mission: Neuer Run = neue Mission";
      this.elements.pauseButton.disabled = this.state !== GAME_STATE.PLAYING;
      this.elements.pauseButton.textContent = "Ⅱ";
      if (this.state === GAME_STATE.START) {
        this.elements.eyebrowText.textContent = `★ Best: ${this.bestScore}   ☕ Kaffee: ${this.coffee}`;
      }
      this.renderSkinButtons();
    }

    renderSkinButtons() {
      this.elements.skinChooser.textContent = "";
      if (this.state !== GAME_STATE.START) {
        return;
      }

      const skin = THEME.skins[this.characterIndex] || THEME.skins[0];
      const unlocked = isCharacterUnlocked(skin, this.progress);
      const selected = this.selectedSkinId === skin.id;
      const requirement = getCharacterRequirement(skin, this.progress);
      const canUnlock = canUnlockCharacter(skin, this.progress);
      const previousButton = this.createCharacterNavButton("<", -1);
      const nextButton = this.createCharacterNavButton(">", 1);
      const actionButton = document.createElement("button");
      const details = document.createElement("div");
      const swatch = document.createElement("span");
      const title = document.createElement("strong");
      const description = document.createElement("span");
      const status = document.createElement("span");

      details.className = "character-card";
      swatch.className = "character-swatch";
      swatch.style.background = skin.colorPrimary;
      title.textContent = skin.name;
      description.textContent = `${skin.title}. ${skin.description}`;
      status.className = "character-status";
      status.textContent = this.characterMessage || (selected ? "Ausgewaehlt" : unlocked ? "Freigeschaltet" : requirement.label);
      details.append(swatch, title, description, status);

      actionButton.type = "button";
      actionButton.className = "skin-button character-action";
      actionButton.textContent = selected ? "Ausgewaehlt" : unlocked ? "Auswaehlen" : "Freischalten";
      actionButton.disabled = selected || (!unlocked && !canUnlock);
      actionButton.addEventListener("click", () => this.handleCharacterAction(skin));

      this.elements.skinChooser.append(previousButton, details, actionButton, nextButton);
    }

    createCharacterNavButton(label, direction) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "skin-button character-nav";
      button.textContent = label;
      button.addEventListener("click", () => {
        this.characterIndex = (this.characterIndex + direction + THEME.skins.length) % THEME.skins.length;
        this.characterMessage = "";
        this.renderSkinButtons();
      });
      return button;
    }

    handleCharacterAction(skin) {
      const unlocked = isCharacterUnlocked(skin, this.progress);
      if (unlocked) {
        this.selectCharacter(skin.id, "Ausgewaehlt!");
        return;
      }

      if (!canUnlockCharacter(skin, this.progress)) {
        this.characterMessage = getCharacterRequirement(skin, this.progress).label;
        this.renderSkinButtons();
        return;
      }

      this.coffee = Math.max(0, this.coffee - skin.priceCoffee);
      this.progress.coffee = this.coffee;
      if (!this.progress.unlockedCharacters.includes(skin.id)) {
        this.progress.unlockedCharacters.push(skin.id);
      }
      this.selectCharacter(skin.id, "Freigeschaltet!");
    }

    selectCharacter(id, message) {
      this.selectedSkinId = id;
      this.progress.selectedCharacterId = id;
      this.characterIndex = Math.max(0, THEME.skins.findIndex((skin) => skin.id === id));
      this.characterMessage = message;
      saveProgress(this.progress);
      writeStorage(STORAGE_KEYS.selectedSkin, id);
      this.syncUi();
    }

    render() {
      const skin = THEME.skins.find((item) => item.id === this.selectedSkinId) || THEME.skins[0];
      this.renderer.draw({
        ...this.model,
        skin,
        isActive: this.state === GAME_STATE.PLAYING || this.state === GAME_STATE.PAUSED
      });
    }

    getSelectedOpponent() {
      const opponent = THEME.opponents.find((item) => item.id === this.selectedOpponentId) || THEME.opponents[0];
      if (!this.customOpponentName) {
        return opponent;
      }

      return {
        ...opponent,
        displayName: this.customOpponentName
      };
    }
  }

  function boot() {
    const elements = {
      canvas: document.getElementById("gameCanvas"),
      toolbar: document.getElementById("gameToolbar"),
      scoreText: document.getElementById("scoreText"),
      bestText: document.getElementById("bestText"),
      goalLabel: document.getElementById("goalLabel"),
      goalText: document.getElementById("goalText"),
      coffeeText: document.getElementById("coffeeText"),
      missionText: document.getElementById("missionText"),
      pauseButton: document.getElementById("pauseButton"),
      overlay: document.getElementById("overlay"),
      eyebrowText: document.getElementById("eyebrowText"),
      titleText: document.querySelector("#overlay h1"),
      overlayText: document.getElementById("overlayText"),
      primaryButton: document.getElementById("primaryButton"),
      menuButton: document.getElementById("menuButton"),
      howToButton: document.getElementById("howToButton"),
      skinChooser: document.getElementById("skinChooser")
    };

    if (!elements.canvas || !elements.canvas.getContext) {
      throw new Error("Canvas #gameCanvas wurde nicht gefunden.");
    }

    new Game(elements).init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
