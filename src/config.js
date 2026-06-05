export const GAME_STATE = {
  START: "start",
  HOW_TO: "howTo",
  PLAYING: "playing",
  PAUSED: "paused",
  GAME_OVER: "gameOver"
};

export const WORLD = {
  width: 432,
  height: 768,
  ground: 102,
  playerStart: { x: 126, y: 318 }
};

export const PHYSICS = {
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

export const THEME = {
  title: "Campus Koller",
  subtitle: "Hilf Byte-Basti durch die Koffeinzone, bevor das Modulhandbuch zurueckschlaegt.",
  howTo: "Tippe, klicke oder druecke Leertaste. Flieg durch die Luecken, sammle Punkte und tu so, als waere das alles Teil des Studiums.",
  dailyGoalPrefix: "Tagesziel",
  comments: [
    "Vom Modulhandbuch freundlich, aber bestimmt beendet.",
    "Zu wenig Kaffee im System.",
    "Du hast versucht, ECTS zu verstehen.",
    "Deadline-Stapel: 1. Byte-Basti: 0.",
    "Die Mensa-Schlange hatte Kollisionsabfrage.",
    "Compiler sagt nein. Sehr deutlich.",
    "Crashkurs bestanden. Betonung auf Crash."
  ],
  scoreBursts: ["ECTS!", "Koffein!", "Noch wach!", "Build gruen!", "Fast akademisch!"],
  obstacles: [
    { id: "whiteWire", label: "WHITE WIRE", detail: "ENERGY", color: "#101820" },
    { id: "deadline", label: "DEADLINE", detail: "23:59", color: "#b83b34" },
    { id: "handbook", label: "MODUL", detail: "450 S.", color: "#315f7d" }
  ],
  skins: [
    {
      id: "basti",
      name: "Byte-Basti",
      unlockScore: 0,
      hoodie: "#2f6f8f",
      hair: "#3b241c",
      laptop: "#26323a"
    },
    {
      id: "debugDora",
      name: "Debug-Dora",
      unlockScore: 8,
      hoodie: "#7453a6",
      hair: "#1f252b",
      laptop: "#203c36"
    },
    {
      id: "profPatch",
      name: "Prof. Patch",
      unlockScore: 18,
      hoodie: "#6b7c47",
      hair: "#f2f2ec",
      laptop: "#473b35"
    }
  ]
};

export const STORAGE_KEYS = {
  bestScore: "campus-koller-best-score",
  selectedSkin: "campus-koller-selected-skin"
};
