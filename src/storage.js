import { STORAGE_KEYS, THEME } from "./config.js";

export class StorageManager {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  getBestScore() {
    return this.readNumber(STORAGE_KEYS.bestScore, 0);
  }

  setBestScore(score) {
    this.write(STORAGE_KEYS.bestScore, String(score));
  }

  getSelectedSkin(bestScore) {
    const saved = this.read(STORAGE_KEYS.selectedSkin);
    const fallback = THEME.skins[0].id;
    const skin = THEME.skins.find((item) => item.id === saved);
    return skin && skin.unlockScore <= bestScore ? skin.id : fallback;
  }

  setSelectedSkin(skinId) {
    this.write(STORAGE_KEYS.selectedSkin, skinId);
  }

  readNumber(key, fallback) {
    const value = Number(this.read(key));
    return Number.isFinite(value) ? value : fallback;
  }

  read(key) {
    try {
      return this.storage.getItem(key);
    } catch (_error) {
      return null;
    }
  }

  write(key, value) {
    try {
      this.storage.setItem(key, value);
    } catch (_error) {
      // Private browsing can block storage; gameplay should continue.
    }
  }
}
