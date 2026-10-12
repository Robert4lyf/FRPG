// Leitner-style spaced repetition, saved in the browser.
// Each word has a box 0-4. Right answer: up one box. Wrong: back to box 0.
// Lower boxes are asked more often. Box 3+ counts as "mastered".
const KEY = 'frpg.progress.v1';
const BOX_WEIGHT = [6, 4, 3, 1, 0.4];
const NEW_WEIGHT = 3;
const MAX_NEW_PER_SESSION = 2;
export const MASTERED_BOX = 3;
export const MAX_BOX = 4;

export default class Progress {
  constructor() {
    this.data = { words: {} };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.words) this.data = saved;
    } catch { /* storage unavailable: progress lasts for this visit only */ }
  }

  static id(topic, word) {
    return `${topic}:${word.fr}`;
  }

  isNew(topic, word) {
    return !this.data.words[Progress.id(topic, word)];
  }

  get(topic, word) {
    return this.data.words[Progress.id(topic, word)] || { box: 0, seen: 0, right: 0 };
  }

  record(topic, word, correct) {
    const r = { ...this.get(topic, word) };
    r.seen += 1;
    if (correct) {
      r.right += 1;
      r.box = Math.min(MAX_BOX, r.box + 1);
    } else {
      r.box = 0;
    }
    this.data.words[Progress.id(topic, word)] = r;
    this.save();
  }

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* ignore */ }
  }

  reset() {
    this.data = { words: {} };
    this.save();
  }

  // Picks n words for one conversation, favouring weak words and
  // introducing at most MAX_NEW_PER_SESSION new ones.
  pickSession(topic, words, n) {
    const pool = [...words];
    const out = [];
    let newCount = 0;
    // Allow extra new words when there aren't enough known ones to fill the session.
    const known = words.filter((w) => !this.isNew(topic, w)).length;
    const maxNew = Math.max(MAX_NEW_PER_SESSION, n - known);
    while (out.length < n && pool.length) {
      const weights = pool.map((w) => {
        if (this.isNew(topic, w)) return newCount >= maxNew ? 0 : NEW_WEIGHT;
        return BOX_WEIGHT[this.get(topic, w).box];
      });
      const total = weights.reduce((a, b) => a + b, 0);
      if (total <= 0) break;
      let r = Math.random() * total;
      let i = 0;
      while (i < pool.length - 1 && r >= weights[i]) { r -= weights[i]; i += 1; }
      const [w] = pool.splice(i, 1);
      if (this.isNew(topic, w)) newCount += 1;
      out.push(w);
    }
    return out;
  }

  topicStats(topic, words) {
    const mastered = words.filter((w) => this.get(topic, w).box >= MASTERED_BOX).length;
    const seen = words.filter((w) => !this.isNew(topic, w)).length;
    const stars = mastered === words.length ? 3 : Math.floor((mastered / words.length) * 3);
    return { mastered, seen, total: words.length, stars };
  }
}
