# Belleville — un polar en français

A film-noir murder mystery played in French. You are Julien Morel, an inspector in Lyon who hasn't been home to Belleville for fifteen years. Then a letter arrives from Hélène, your childhood friend: *"Reviens. J'ai peur."* You see her alive for one evening. The next morning she is dead in the fountain, and the town you left is full of people who knew you, and who are all hiding something.

The French is the game, not a lesson: you understand the dialogue to catch lies, connect clues and move the case forward. Old friends call you *tu*; people who resent you insist on *vous*, and when someone switches, it means something. Aimed at players with school-level French (around GCSE). Built with HTML/JS and [Phaser 3](https://phaser.io), with no build step.

## Play

Enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root), then play at
https://robert4lyf.github.io/FRPG/

- **Move:** arrow keys / WASD, or tap where you want to go.
- **Talk / examine:** tap a person or a glinting clue, or press Space next to it.
- **Questioning:** pick a question, or **Présenter une preuve** to confront someone with a clue or another witness's statement.
- **Help with French:** tap any gold word for its meaning and pronunciation. Tap **EN** to see the English for a line. Tap the objective box for English too.
- **Carnet (notebook):** clues, witness statements, and every vocabulary word you've met. Key: C.
- **Le rapport:** each chapter ends with you typing up the case report, filling blanks from French options. Mistakes cost nothing but are saved as words to bring back in later chapters.

### Install on your phone (full-screen, no address bar)

- **iPhone (Safari):** Share → Add to Home Screen.
- **Android (Chrome):** ⋮ menu → Add to Home screen / Install app.

## Story structure

Each chapter's grammar is what the investigation needs:

| Chapter | Story | Grammar |
|---|---|---|
| Prologue (done) | The letter, the last evening with Hélène | Present, passé composé |
| 1. Trop tard (done) | The scene, old friends and old grudges, the first lie, the post-mortem | Present, passé composé, a little imparfait |
| 2. La nuit du crime | Rebuilding the night, breaking alibis | Imparfait vs passé composé |
| 3. Les secrets | Letters, the victim's diary, a second death | Plus-que-parfait, pronouns, *qui/que/dont* |
| 4. La vérité | Hypotheses and the accusation | Conditionnel, subjonctif |

## Writing content

Chapter scripts live in `src/story/`. Each line is:

```js
{ s: 'dubois', fr: 'Elle est [[tombée|fell]].', en: 'She fell.', record: 'statement_id', set: 'flag' }
```

- `[[word|gloss]]` marks a vocabulary word (gold, tappable, added to the Carnet).
- `e: 'hostile'` or `e: 'shaken'` sets the speaker's portrait expression for that line (neutral otherwise). Keep them for key moments.
- `record` adds a witness statement to the notebook; `set` sets a story flag.
- Questions can `require` flags, clues or statements. `evidence` maps a clue/statement id to the reaction when it's presented.
- French dialogue should be reviewed by a native speaker before release.

## Layout

```
src/story/chapter1.js    script: cast, clues, statements, dialogue, objectives
src/story/state.js       case progress (saved in the browser)
src/scenes/WorldScene.js town, characters, clues, tap-to-walk pathfinding
src/scenes/UIScene.js    dialogue, interrogation, evidence, Carnet, title cards
src/ui/theme.js          noir UI kit and tappable-word text renderer
src/fx/noir.js           night lighting, colour grading, rain, grain, lightning, rain/thunder audio
src/world/               town layout and tile reference
src/learning/speech.js   French pronunciation (browser text-to-speech)
```

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000.

## Credits

Art and sounds by [Kenney](https://kenney.nl) (CC0). Fonts: Special Elite (Apache 2.0) and Courier Prime (OFL). Details in `assets/CREDITS.md`.
