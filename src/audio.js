export class AudioManager {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.musicNode = null;
  }

  unlock() {
    if (!this.enabled || this.context) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      this.enabled = false;
      return;
    }

    this.context = new AudioContextClass();
  }

  playFlap() {
    this.playTone(540, 0.045, "square", 0.035);
  }

  playScore() {
    this.playTone(820, 0.08, "sine", 0.045);
    window.setTimeout(() => this.playTone(1040, 0.06, "sine", 0.035), 45);
  }

  playCrash() {
    this.playTone(130, 0.16, "sawtooth", 0.06);
  }

  playButton() {
    this.playTone(360, 0.04, "triangle", 0.03);
  }

  startMusic() {
    // Placeholder hook for a real looped music asset in a native/App Store build.
    if (!this.context || this.musicNode) {
      return;
    }
  }

  stopMusic() {
    this.musicNode = null;
  }

  playTone(frequency, duration, type, volume) {
    if (!this.context || this.context.state === "closed") {
      return;
    }

    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
}
