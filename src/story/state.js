import { CLUES, STATEMENTS } from './story.js';

// Case progress: flags, clues found, statements recorded, words met, topics asked.
// Saved to the browser after every change.
const KEY = 'frpg.case.v2'; // v2: prologue and new story (old saves start fresh)

export default class GameState {
  constructor() {
    this.reset(false);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.flags) Object.assign(this, GameState.revive(saved));
    } catch { /* storage unavailable */ }
    this.listeners = [];
  }

  static revive(d) {
    return {
      flags: new Set(d.flags),
      clues: d.clues,
      statements: d.statements,
      words: d.words,
      asked: new Set(d.asked),
      review: d.review || {},
      looked: d.looked || {},
    };
  }

  reset(save = true) {
    this.flags = new Set();
    this.clues = []; // ids in order found
    this.statements = [];
    this.words = {}; // fr -> en
    this.asked = new Set(); // `${who}:${topic}`
    this.review = {}; // fr -> times got wrong in a report (to bring back in later chapters)
    this.looked = {}; // fr -> times the player tapped it for a translation
    if (save) this.save();
  }

  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        flags: [...this.flags], clues: this.clues, statements: this.statements,
        words: this.words, asked: [...this.asked], review: this.review, looked: this.looked,
      }));
    } catch { /* ignore */ }
    this.listeners?.forEach((fn) => fn());
  }

  onChange(fn) { this.listeners.push(fn); }

  // `has` covers flags, clues and statements, so script `requires` can mix them.
  has(id) {
    return this.flags.has(id) || this.clues.includes(id) || this.statements.includes(id);
  }

  set(flag) {
    if (this.flags.has(flag)) return;
    this.flags.add(flag);
    this.save();
  }

  addClue(id) {
    if (!CLUES[id] || this.clues.includes(id)) return false;
    this.clues.push(id);
    this.save();
    return true;
  }

  addStatement(id) {
    if (!STATEMENTS[id] || this.statements.includes(id)) return false;
    this.statements.push(id);
    this.save();
    return true;
  }

  // Returns true if the word is new.
  addWord(fr, en) {
    const key = fr.toLowerCase();
    if (this.words[key]) return false;
    this.words[key] = en;
    this.save();
    return true;
  }

  addReview(fr) {
    this.review[fr] = (this.review[fr] || 0) + 1;
    this.save();
  }

  markLooked(fr) {
    const key = fr.toLowerCase();
    this.looked[key] = (this.looked[key] || 0) + 1;
    this.save();
  }

  markAsked(who, topic) {
    this.asked.add(`${who}:${topic}`);
    this.save();
  }

  wasAsked(who, topic) { return this.asked.has(`${who}:${topic}`); }

  clueCount() { return this.clues.length; }

  evidence() {
    return [
      ...this.clues.map((id) => ({ id, kind: 'clue', label: CLUES[id].name, en: CLUES[id].en })),
      ...this.statements.map((id) => ({ id, kind: 'statement', label: STATEMENTS[id].fr, en: STATEMENTS[id].en, who: STATEMENTS[id].who })),
    ];
  }
}
