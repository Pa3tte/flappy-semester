export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function chooseByIndex(items, index) {
  return items[Math.abs(index) % items.length];
}

export function todaySeed(date = new Date()) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
