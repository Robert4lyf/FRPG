# French Language RPG — Belleville

A pixel RPG for learning French. Walk around the town of Belleville and talk to the townspeople; each one teaches a topic through short quizzes. Built with HTML/JS and [Phaser 3](https://phaser.io), with no build step.

## Play

Enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root), then play at
https://robert4lyf.github.io/FRPG/

- **Move:** arrow keys / WASD, or tap where you want to go (the player pathfinds around obstacles).
- **Talk:** tap a person, or press Space/E next to them.
- **Answer:** tap a button or press 1–3. Tap or Space to continue.
- **Carnet (notebook):** shows every word, your progress, and plays pronunciation. Key: J.

### Install on your phone (full-screen, no address bar)

- **iPhone (Safari):** Share → Add to Home Screen.
- **Android (Chrome):** ⋮ menu → Add to Home screen / Install app.

Then open Belleville from the home-screen icon.

## How learning works

- 10 townspeople, 10 topics, 80 words (`src/data/topics.js`).
- New words are introduced before they're tested.
- Three question types: French → English, English → French, and listening (uses the browser's built-in French voice when one is installed).
- Spaced repetition (Leitner boxes): right answers move a word up a box, wrong answers send it back to box 0, and weaker words come up more often. Box 3+ counts as mastered. Progress is saved in the browser.
- Stars above each person show how much of their topic you've mastered.

## Run locally

ES modules need a web server:

```
python3 -m http.server
```

Then open http://localhost:8000.

## Layout

```
index.html                 entry point (Phaser from CDN, pixel font)
src/main.js                game config, sizes the game to the screen shape
src/scenes/BootScene.js    asset loading, walk animations
src/scenes/WorldScene.js   tilemap, player, NPCs, camera, tap-to-move pathfinding
src/scenes/UIScene.js      dialogue, quiz buttons, HUD, Carnet
src/world/town.js          town layout (built in code from tile indices)
src/world/tiles.js         tile index reference for the urban tileset
src/data/topics.js         vocabulary
src/data/npcs.js           townspeople, positions, greetings
src/learning/              quiz generator, spaced repetition, speech
assets/                    sprites, UI, sounds, font (see assets/CREDITS.md)
```

## Adding content

- **Words:** add `{ fr, en }` to a topic in `src/data/topics.js` (minimum 3 per topic).
- **Person:** add an entry to `NPCS` in `src/data/npcs.js` with a walkable tile position, sprite (1–5), topic and greeting.
- **Map:** edit `src/world/town.js`; tile numbers are listed in `src/world/tiles.js`.

## Credits

Art, UI and sounds by [Kenney](https://kenney.nl) (CC0). Font: Pixelify Sans (OFL). Details in `assets/CREDITS.md`.
