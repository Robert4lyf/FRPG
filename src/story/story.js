// One place that knows which chapter is being played and merges every chapter's data.
// People, clues and statements keep the same ids across chapters, so the Carnet carries over.
import * as C1 from './chapter1.js';
import * as C2 from './chapter2.js';

export const PLAYER_NAME = C1.PLAYER_NAME;

// People: names and roles, plus where they stand in each phase.
export const CAST = {};
Object.entries({ ...C1.CAST, ...C2.CAST2 }).forEach(([id, c]) => {
  const at = {};
  (c.phases || []).forEach((p) => { at[p] = { x: c.x, y: c.y }; });
  if (C2.PLACES2[id]) at.ch2 = C2.PLACES2[id];
  CAST[id] = { name: c.name, role: c.role, at };
});

const tagged = (obj, phase) => Object.fromEntries(Object.entries(obj).map(([id, v]) => [id, { phase, ...v }]));

export const CLUES = { ...tagged(C1.CLUES, 'ch1'), ...tagged(C2.CLUES2, 'ch2') };
Object.entries(C2.TIMES1).forEach(([id, t]) => { if (CLUES[id]) CLUES[id].t = t; });

export const STATEMENTS = { ...C1.STATEMENTS, ...C2.STATEMENTS2 };
Object.entries(C2.TIMES1).forEach(([id, t]) => { if (STATEMENTS[id]) STATEMENTS[id] = { ...STATEMENTS[id], t }; });

export const CONFLICTS = C2.CONFLICTS;

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
    outroSub: 'Chapitre 3 — Les secrets · bientôt\nChapter 3 — Secrets · coming soon',
    flags: { done: 'ch2_done', report: 'ch2_report_done', outro: 'ch2_outro_seen', start: 'ch2_started' },
    festival: true, timeline: true,
  },
};

export function phaseOf(state) {
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
