import { PHYSICS, THEME, WORLD } from "./config.js";
import { clamp } from "./utils.js";

export class Renderer {
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
    this.drawSky();
    this.drawClouds(model.clouds);
    this.drawObstacles(model.obstacles);
    this.drawGround(model.distance, model.reducedMotion);
    this.drawPlayer(model.player, model.skin);
    this.drawParticles(model.particles);
    this.drawFloatingTexts(model.floatingTexts);
    this.drawScore(model.score, model.isActive);
  }

  drawSky() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, "#79c7e8");
    gradient.addColorStop(0.62, "#c7ebdf");
    gradient.addColorStop(1, "#efe0a3");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    for (let y = 92; y < WORLD.height - WORLD.ground; y += 112) {
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

  drawObstacles(obstacles) {
    for (const obstacle of obstacles) {
      const topHeight = obstacle.gapY - obstacle.gap / 2;
      const bottomY = obstacle.gapY + obstacle.gap / 2;
      this.drawObstacleStack(obstacle.x, 0, topHeight, obstacle.type, true);
      this.drawObstacleStack(obstacle.x, bottomY, WORLD.height - WORLD.ground - bottomY, obstacle.type, false);
    }
  }

  drawObstacleStack(x, y, height, type, flipped) {
    if (height <= 0) {
      return;
    }

    const canX = x + 5;
    const canWidth = PHYSICS.obstacleWidth - 10;
    const bottomY = y + height;
    const radius = 13;
    const gradient = this.ctx.createLinearGradient(canX, 0, canX + canWidth, 0);
    gradient.addColorStop(0, "#d5dde3");
    gradient.addColorStop(0.18, "#ffffff");
    gradient.addColorStop(0.55, "#f4f7f8");
    gradient.addColorStop(1, "#bac7cf");

    this.ctx.save();
    this.ctx.fillStyle = gradient;
    this.roundedRect(canX, y, canWidth, height, radius);
    this.ctx.fill();
    this.ctx.strokeStyle = "#93a4ad";
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    this.ctx.fillStyle = "#e9eef1";
    this.ctx.fillRect(canX + 6, y + 7, canWidth - 12, 9);
    this.ctx.fillRect(canX + 6, bottomY - 16, canWidth - 12, 9);
    this.ctx.strokeStyle = "#9eabb2";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.ellipse(canX + canWidth / 2, y + 10, canWidth * 0.36, 5, 0, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.ellipse(canX + canWidth / 2, bottomY - 10, canWidth * 0.36, 5, 0, 0, Math.PI * 2);
    this.ctx.stroke();

    const labelY = flipped ? bottomY - 86 : y + 36;
    this.drawObstacleLabel(canX + canWidth / 2, clamp(labelY, y + 30, bottomY - 96), type, flipped);
    this.ctx.restore();
  }

  drawObstacleLabel(centerX, y, type, flipped) {
    this.ctx.save();
    this.ctx.translate(centerX, y + 46);
    if (flipped) {
      this.ctx.rotate(Math.PI);
    }

    this.ctx.fillStyle = type.color;
    this.ctx.font = "900 10px ui-rounded, system-ui, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText(type.label, 0, -34);
    this.ctx.font = "900 9px ui-rounded, system-ui, sans-serif";
    this.ctx.fillText(type.detail, 0, 45);
    this.ctx.strokeStyle = "#cfd7dc";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-23, -48, 46, 96);

    this.ctx.strokeStyle = "#f3f7f8";
    this.ctx.lineWidth = 5;
    this.drawScratchMark();
    this.ctx.strokeStyle = type.color;
    this.ctx.lineWidth = 3;
    this.drawScratchMark();
    this.ctx.restore();
  }

  drawScratchMark() {
    for (let i = -1; i <= 1; i += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(-12 + i * 11, -18);
      this.ctx.lineTo(-18 + i * 11, 12);
      this.ctx.lineTo(-11 + i * 11, 32);
      this.ctx.stroke();
    }
  }

  drawGround(distance, reducedMotion) {
    const groundY = WORLD.height - WORLD.ground;
    this.ctx.fillStyle = "#d9a84d";
    this.ctx.fillRect(0, groundY, WORLD.width, WORLD.ground);
    this.ctx.fillStyle = "#638d60";
    this.ctx.fillRect(0, groundY, WORLD.width, 18);

    const offset = reducedMotion ? 0 : -(distance % 36);
    for (let x = offset; x < WORLD.width + 36; x += 36) {
      this.ctx.fillStyle = "#486f4c";
      this.ctx.fillRect(x, groundY + 6, 24, 5);
      this.ctx.fillStyle = "rgba(120, 77, 35, 0.2)";
      this.ctx.fillRect(x + 8, groundY + 34, 28, 5);
      this.ctx.fillRect(x - 12, groundY + 68, 24, 4);
    }
  }

  drawPlayer(player, skin) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);

    const flapOffset = Math.sin((1 - player.flapPose) * Math.PI) * 7;
    ctx.strokeStyle = "rgba(22, 49, 61, 0.42)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-18, 11);
    ctx.lineTo(-34, 23 + flapOffset);
    ctx.moveTo(12, 12);
    ctx.lineTo(28, 25 - flapOffset);
    ctx.stroke();

    ctx.fillStyle = skin.hoodie;
    ctx.beginPath();
    ctx.ellipse(-2, 11, 18, 20, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#17394c";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.strokeStyle = "#d7e9f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-9, 3);
    ctx.lineTo(-9, 15);
    ctx.moveTo(5, 3);
    ctx.lineTo(5, 15);
    ctx.stroke();

    ctx.fillStyle = "#f3bf8f";
    ctx.strokeStyle = "#5d372b";
    ctx.lineWidth = 2.5;
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

    ctx.strokeStyle = "#17394c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-12, 28);
    ctx.lineTo(-20, 39);
    ctx.moveTo(6, 29);
    ctx.lineTo(17, 39);
    ctx.stroke();
    ctx.restore();
  }

  drawGlasses() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#101820";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.rect(-11, -15, 10, 7);
    ctx.rect(4, -15, 10, 7);
    ctx.moveTo(-1, -12);
    ctx.lineTo(4, -12);
    ctx.moveTo(-16, -12);
    ctx.lineTo(-22, -15);
    ctx.moveTo(14, -12);
    ctx.lineTo(20, -15);
    ctx.stroke();
  }

  drawParticles(particles) {
    const ctx = this.ctx;
    for (const particle of particles) {
      ctx.save();
      ctx.globalAlpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawFloatingTexts(texts) {
    const ctx = this.ctx;
    for (const item of texts) {
      ctx.save();
      ctx.globalAlpha = clamp(item.life / item.maxLife, 0, 1);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(22, 49, 61, 0.45)";
      ctx.lineWidth = 4;
      ctx.font = "900 18px ui-rounded, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(item.text, item.x, item.y);
      ctx.fillText(item.text, item.x, item.y);
      ctx.restore();
    }
  }

  drawScore(score, isActive) {
    if (!isActive) {
      return;
    }

    this.ctx.save();
    this.ctx.font = "800 54px ui-rounded, system-ui, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.lineWidth = 7;
    this.ctx.strokeStyle = "rgba(22, 49, 61, 0.42)";
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeText(String(score), WORLD.width / 2, 92);
    this.ctx.fillText(String(score), WORLD.width / 2, 92);
    this.ctx.restore();
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

export { THEME };
