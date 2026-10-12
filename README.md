# French Language RPG (FRPG)

A simple pixel RPG to help players learn and improve their French. Built with HTML/JS and [Phaser 3](https://phaser.io), with no build step.

## Play

Once GitHub Pages is enabled (Settings → Pages → Deploy from branch → `main` / root), the game is at:
https://robert4lyf.github.io/FRPG/

Controls: arrow keys/WASD or tap to move. Walk into a character to talk. Answer with 1–3 or by tapping.

## Run locally

ES modules need a web server, so opening `index.html` directly won't work:

```
python3 -m http.server
```

Then open http://localhost:8000.

## Layout

```
index.html               entry point (loads Phaser from CDN)
src/main.js              game config
src/scenes/WorldScene.js map, player, NPCs, movement
src/ui/DialogueBox.js    dialogue and multiple-choice UI
src/quiz.js              question generator
src/data/vocab.js        vocabulary by topic, and NPC definitions
```

## Adding content

- New words: add `{ fr, en }` entries to a topic in `src/data/vocab.js`. Each topic needs at least 3 words.
- New character: add an entry to `NPCS` with a tile position, name, topic and greeting.

Graphics are placeholder pixel art drawn in code; real sprites can go in `assets/` later.
