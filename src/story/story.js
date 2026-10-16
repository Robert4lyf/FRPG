// One place that knows which chapter is being played and merges every chapter's data.
// People, clues and statements keep the same ids across chapters, so the Carnet carries over.
import * as C1 from './chapter1.js';
import * as C2 from './chapter2.js';
import * as C3 from './chapter3.js';

export const PLAYER_NAME = C1.PLAYER_NAME;

// People: names and roles, plus where they stand in each phase.
export const CAST = {};
Object.entries({ ...C1.CAST, ...C2.CAST2, ...C3.CAST3 }).forEach(([id, c]) => {
  const at = {};
  (c.phases || []).forEach((p) => { at[p] = { x: c.x, y: c.y }; });
  if (C2.PLACES2[id]) at.ch2 = C2.PLACES2[id];
  if (C3.PLACES3[id]) at.ch3 = C3.PLACES3[id];
  CAST[id] = { name: c.name, role: c.role, at };
});

// Earlier chapters' scenes that now happen indoors.
const INDOORS1 = {
  claire: { ch1: { x: 7, y: 2, room: 'ecole' } },
  theo: { prologue: { x: 3, y: 3, room: 'cafe' }, ch1: { x: 11, y: 3, room: 'cafe' } },
};
Object.entries(INDOORS1).forEach(([id, by]) => Object.assign(CAST[id].at, by));

// Where a person stands in a phase, given the story so far (null: not there).
// A phase's entry is either {x, y} or a list of options with `if` / `unless` flags.
export function placeOf(id, phase, state) {
  const at = CAST[id]?.at[phase];
  if (!at) return null;
  if (!Array.isArray(at)) return at;
  return at.find((o) => (o.if || []).every((f) => state.has(f)) && !(o.unless && state.has(o.unless))) || null;
}

const tagged = (obj, phase) => Object.fromEntries(Object.entries(obj).map(([id, v]) => [id, { phase, ...v }]));

export const CLUES = { ...tagged(C1.CLUES, 'ch1'), ...tagged(C2.CLUES2, 'ch2'), ...tagged(C3.CLUES3, 'ch3') };
Object.entries(C2.TIMES1).forEach(([id, t]) => { if (CLUES[id]) CLUES[id].t = t; });

export const STATEMENTS = { ...tagged(C1.STATEMENTS, 'ch1'), ...tagged(C2.STATEMENTS2, 'ch2'), ...tagged(C3.STATEMENTS3, 'ch3') };
Object.entries(C2.TIMES1).forEach(([id, t]) => { if (STATEMENTS[id]) STATEMENTS[id] = { ...STATEMENTS[id], t }; });

export const CONFLICTS = C2.CONFLICTS;
export const DIARY = C3.DIARY;

export const INTRO = C1.INTRO;
export const NIGHT = C1.NIGHT;

// Per-phase settings. flags: when the case is solved, the report written, the outro seen.
export const CHAPTERS = {
  prologue: {
    id: 'prologue', ...C1.PROLOGUE, dialogue: C1.PROLOGUE_DIALOGUE, objectives: C1.OBJECTIVES,
    memories: {}, metKey: (id) => `met_${id}_p`, askKey: (t) => t, evidence: false,
  },
  ch1: {
    ...C1.CHAPTER, dialogue: C1.DIALOGUE, objectives: C1.OBJECTIVES, memories: C1.MEMORIES,
    metKey: (id) => `met_${id}`, askKey: (t) => t, evidence: true,
    report: C1.REPORT, outro: C1.OUTRO, outroTitle: 'FIN DU CHAPITRE 1',
    outroSub: 'Chapitre 2 — La nuit du crime\nChapter 2 — The Night of the Crime',
    flags: { done: 'chapter1_done', report: 'report_done', outro: 'outro_seen' },
    crimeScene: true, next: 'ch2',
  },
  ch2: {
    ...C2.CHAPTER2, dialogue: C2.DIALOGUE2, objectives: C2.OBJECTIVES2, memories: C2.MEMORIES2,
    metKey: (id) => `met2_${id}`, askKey: (t) => `ch2.${t}`, evidence: true,
    intro: C2.INTRO2,
    report: C2.REPORT2, outro: C2.OUTRO2, outroTitle: 'FIN DU CHAPITRE 2',
    outroSub: 'Chapitre 3 — Les secrets\nChapter 3 — Secrets',
    flags: { done: 'ch2_done', report: 'ch2_report_done', outro: 'ch2_outro_seen', start: 'ch2_started' },
    festival: true, timeline: true, next: 'ch3', enter: C2.ENTER2,
  },
  ch3: {
    ...C3.CHAPTER3, dialogue: C3.DIALOGUE3, objectives: C3.OBJECTIVES3, memories: C3.MEMORIES3,
    metKey: (id) => `met3_${id}`, askKey: (t) => `ch3.${t}`, evidence: true,
    report: C3.REPORT3, outro: C3.OUTRO3, outroTitle: 'FIN DU CHAPITRE 3',
    outroSub: 'Chapitre 4 — La vérité · bientôt\nChapter 4 — The Truth · coming soon',
    flags: { done: 'ch3_done', report: 'ch3_report_done', outro: 'ch3_outro_seen', start: 'ch3_started' },
    fog: true, bus: true, diary: true,
  },
};

export function phaseOf(state) {
  if (state.has('ch3_started')) return 'ch3';
  if (state.has('ch2_started')) return 'ch2';
  if (state.has('prologue_done')) return 'ch1';
  return 'prologue';
}

export const chapterOf = (phase) => CHAPTERS[phase];

// Sorting key for timeline times: hours after midnight count as late evening.
export const timeKey = (t) => {
  const [h, m] = t.split(':').map(Number);
  return (h < 6 ? h + 24 : h) * 60 + m;
};
