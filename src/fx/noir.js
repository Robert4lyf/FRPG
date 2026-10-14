// Film-noir atmosphere: generated textures, night lighting, colour grading,
// rain, film grain, lightning and synthesised rain/thunder audio.

export function makeFxTextures(scene) {
  const tex = scene.textures;

  // Soft radial light, used to cut holes in the darkness and for glows.
  if (!tex.exists('light')) {
    const c = tex.createCanvas('light', 128, 128);
    const ctx = c.getContext();
    // Soft, wide fall-off so lamplight spreads gently into the surrounding night.
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.88)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.8, 'rgba(255,255,255,0.2)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    c.refresh();
  }

  if (!tex.exists('raindrop')) {
    const c = tex.createCanvas('raindrop', 2, 22);
    const ctx = c.getContext();
    const g = ctx.createLinearGradient(0, 0, 0, 22);
    g.addColorStop(0, 'rgba(210,220,235,0)');
    g.addColorStop(1, 'rgba(210,220,235,0.9)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2, 22);
    c.refresh();
  }

  if (!tex.exists('grain')) {
    const size = 160;
    const c = tex.createCanvas('grain', size, size);
    const ctx = c.getContext();
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v;
      img.data[i + 3] = Math.random() < 0.5 ? 255 : 0;
    }
    ctx.putImageData(img, 0, 0);
    c.refresh();
  }

  // Small evidence glint and an examined-evidence marker.
  if (!tex.exists('glint')) {
    const c = tex.createCanvas('glint', 7, 7);
    const ctx = c.getContext();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, 0, 1, 7);
    ctx.fillRect(0, 3, 7, 1);
    ctx.fillRect(2, 2, 3, 3);
    c.refresh();
  }
  if (!tex.exists('marker')) {
    const c = tex.createCanvas('marker', 6, 6);
    const ctx = c.getContext();
    ctx.fillStyle = '#e8c547';
    ctx.beginPath();
    ctx.moveTo(3, 0); ctx.lineTo(6, 6); ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    c.refresh();
  }
}

// Desaturate, add contrast and a vignette (WebGL only; canvas fallback skips it).
export function gradeCamera(cam) {
  if (!cam.postFX) return;
  const cm = cam.postFX.addColorMatrix();
  cm.saturate(-0.25);
  cm.contrast(0.12, true);
  cam.postFX.addVignette(0.5, 0.5, 0.9, 0.35);
}

// Night: a dark layer over the world with soft holes cut by lamps, windows,
// the crime-scene floodlight, and small lights carried by people.
export class NightLighting {
  constructor(scene, width, height, lights) {
    this.scene = scene;
    this.cam = scene.cameras.main;
    // Only the visible area (plus a margin) is redrawn each frame, not the whole map.
    this.margin = 48;
    const vw = Math.ceil(this.cam.width / this.cam.zoom) + this.margin * 2;
    const vh = Math.ceil(this.cam.height / this.cam.zoom) + this.margin * 2;
    this.rt = scene.add.renderTexture(0, 0, vw, vh).setOrigin(0).setDepth(2050);
    this.vw = vw;
    this.vh = vh;
    const strength = { lamp: 1, window: 0.9, flood: 1, neon: 0.7, lantern: 0.75, candle: 0.7 };
    this.lights = lights.map((l, i) => ({
      ...l, strength: strength[l.kind] ?? 0.8, flicker: l.kind === 'neon' || (l.kind === 'lamp' && i % 4 === 1), candle: l.kind === 'candle',
    }));
    this.movers = [];
    this.t = 0;

    // Coloured halos on top of the darkness.
    // Sodium-yellow street lamps, amber windows, a paler floodlight.
    // Each light = a multiply tint (turns the lit ground yellow without bleaching it)
    // plus a faint additive bloom.
    const colour = { lamp: 0xffb020, window: 0xff9428, flood: 0xffdc8a, neon: 0x3cff7a, lantern: 0xff6a2a, candle: 0xffa040 };
    this.glows = this.lights.map((l) => {
      const tint = scene.add.image(l.x, l.y, 'light')
        .setScale((l.radius * 2) / 128).setTint(colour[l.kind]).setAlpha(1)
        .setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(2055);
      const bloom = scene.add.image(l.x, l.y, 'light')
        .setScale((l.radius * 1.6) / 128).setTint(colour[l.kind]).setAlpha(0.14)
        .setBlendMode(Phaser.BlendModes.ADD).setDepth(2060);
      // The source itself glows: bulbs on lamp heads, panes of lit windows, the floodlight face.
      const src = (l.bulbs || []).map((bl) => {
        if (bl.w) {
          return scene.add.rectangle(bl.x, bl.y, bl.w, bl.h, colour[l.kind], 0.28)
            .setOrigin(0).setBlendMode(Phaser.BlendModes.ADD).setDepth(2065);
        }
        return scene.add.image(bl.x, bl.y, 'light').setScale((bl.r || 6) * 2 / 128)
          .setTint(l.kind === 'neon' ? 0x7dffaa : 0xfff0b0).setAlpha(l.kind === 'neon' ? 0.6 : 1)
          .setBlendMode(Phaser.BlendModes.ADD).setDepth(2065);
      });
      const base = src.map((o) => o.alpha);
      return {
        tint, bloom, src,
        setAlpha(a) {
          tint.setAlpha(a); bloom.setAlpha(0.14 * a);
          src.forEach((o, k) => o.setAlpha(base[k] * (0.25 + 0.75 * a)));
        },
      };
    });
  }

  // Sprites that carry a small light with them (radius in px).
  follow(sprite, radius, alpha = 0.8) {
    this.movers.push({ sprite, radius, alpha });
  }

  update(dt) {
    this.t += dt;
    const rt = this.rt;
    const ox = Math.floor(this.cam.scrollX + (this.cam.width - this.cam.width / this.cam.zoom) / 2) - this.margin;
    const oy = Math.floor(this.cam.scrollY + (this.cam.height - this.cam.height / this.cam.zoom) / 2) - this.margin;
    rt.setPosition(ox, oy);
    rt.clear();
    rt.fill(0x0b1838, 0.62);
    const visible = (x, y, r) => x + r > ox && x - r < ox + this.vw && y + r > oy && y - r < oy + this.vh;
    this.lights.forEach((l, i) => {
      let a = 1;
      if (l.flicker) {
        // Occasional stutter, like a failing bulb.
        const n = Math.sin(this.t * 0.013 + i) + Math.sin(this.t * 0.031 + i * 3);
        a = n > 1.6 ? 0.25 : 1;
        this.glows[i].setAlpha(a);
      } else if (l.candle) {
        // Candles waver gently rather than stutter.
        a = 0.8 + 0.2 * Math.sin(this.t * 0.011 + i * 1.7) * Math.sin(this.t * 0.007 + i);
        this.glows[i].setAlpha(a);
      }
      if (visible(l.x, l.y, l.radius)) {
        rt.stamp('light', undefined, l.x - ox, l.y - oy, { scale: (l.radius * 2) / 128, erase: true, alpha: a * l.strength * 0.9 });
      }
    });
    this.movers.forEach((m) => {
      if (!m.sprite.visible || !visible(m.sprite.x, m.sprite.y, m.radius)) return;
      rt.stamp('light', undefined, m.sprite.x - ox, m.sprite.y + 2 - oy, { scale: (m.radius * 2) / 128, erase: true, alpha: m.alpha });
    });
  }
}

// Screen-space weather for the UI scene: rain, grain, lightning.
export class Weather {
  constructor(scene, audio) {
    this.scene = scene;
    this.audio = audio;
    const { width: W, height: H } = scene.scale;

    const speed = 1000;
    scene.add.particles(0, 0, 'raindrop', {
      x: { min: -W * 0.25, max: W * 1.1 },
      y: -30,
      lifespan: ((H + 80) / speed) * 1000,
      speedX: { min: -170, max: -130 },
      speedY: { min: speed * 0.9, max: speed * 1.1 },
      rotate: 9,
      scaleY: { min: 0.6, max: 1.3 },
      alpha: { min: 0.12, max: 0.32 },
      quantity: Math.ceil(W / 300),
      frequency: 18,
    }).setDepth(40);

    this.grain = scene.add.tileSprite(0, 0, W, H, 'grain').setOrigin(0).setAlpha(0.07).setDepth(45);
    this.flash = scene.add.rectangle(0, 0, W, H, 0xffffff, 1).setOrigin(0).setAlpha(0).setDepth(46);
    this.scheduleLightning(20000);
  }

  scheduleLightning(min = 35000) {
    this.scene.time.delayedCall(min + Math.random() * 45000, () => this.lightning());
  }

  lightning() {
    const s = this.scene;
    s.tweens.chain({
      targets: this.flash,
      tweens: [
        { alpha: 0.32, duration: 60 },
        { alpha: 0.05, duration: 90 },
        { alpha: 0.22, duration: 50 },
        { alpha: 0, duration: 600 },
      ],
    });
    s.time.delayedCall(900 + Math.random() * 1200, () => this.audio?.thunder());
    this.scheduleLightning();
  }

  update() {
    this.grain.tilePositionX = Math.random() * 160;
    this.grain.tilePositionY = Math.random() * 160;
  }
}

// Rain and thunder made from filtered noise, so no audio files are needed.
export class NoirAudio {
  constructor(soundManager) {
    this.ctx = soundManager.context;
    // Route through Phaser's mute node so the Son button silences rain and thunder too.
    this.out = soundManager.destination || soundManager.masterMuteNode;
    if (!this.ctx || !this.out) return;
    // Own on/off switch for everything here, so muting never depends on Phaser's node alone.
    this.switch = this.ctx.createGain();
    this.switch.gain.value = 1;
    this.switch.connect(this.out);
    this.noise = this.makeNoise(3);
    this.startRain();
  }

  makeNoise(seconds) {
    const ctx = this.ctx;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      // Slightly "pink" noise: softer than white noise, closer to rain.
      last = 0.97 * last + 0.03 * (Math.random() * 2 - 1);
      d[i] = (Math.random() * 2 - 1) * 0.6 + last * 4;
    }
    return buf;
  }

  startRain() {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 400;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 3800;
    const gain = ctx.createGain();
    gain.gain.value = 0.0;
    gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 4);
    src.connect(hp).connect(lp).connect(gain).connect(this.switch);
    src.start();
  }

  setMuted(m) {
    this.muted = m;
    if (this.switch) {
      this.switch.gain.cancelScheduledValues(this.ctx.currentTime);
      this.switch.gain.setValueAtTime(m ? 0 : 1, this.ctx.currentTime);
    }
  }

  thunder() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 140;
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.9, t + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
    src.connect(lp).connect(gain).connect(this.switch);
    src.start(t);
    src.stop(t + 3.3);
  }

  // ---------- music: a quiet noir trio (piano, double bass, brushes), synthesised ----------

  setTheme(name) {
    if (!this.ctx || this.themeName === name) return;
    this.themeName = name;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    // Fade the old theme out and drop it; start the new one fading in.
    if (this.music) {
      const old = this.music;
      old.bus.gain.cancelScheduledValues(t);
      old.bus.gain.setTargetAtTime(0, t, 0.6);
      clearInterval(old.timer);
      setTimeout(() => old.bus.disconnect(), 4000);
    }
    const theme = THEMES[name];
    if (!theme) { this.music = null; return; }
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.gain.setTargetAtTime(theme.volume ?? 0.13, t + 0.3, 1.2);
    // A short echo stands in for the room.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.31;
    const fb = ctx.createGain(); fb.gain.value = 0.28;
    const wet = ctx.createGain(); wet.gain.value = 0.22;
    bus.connect(this.switch);
    bus.connect(delay); delay.connect(fb).connect(delay); delay.connect(wet).connect(this.switch);
    const m = { bus, theme, beat: 0, next: Math.max(t + 0.2, t), timer: null };
    const spb = 60 / theme.bpm;
    m.timer = setInterval(() => {
      // Schedule a little ahead so the timing stays steady even if a frame is slow.
      while (m.next < this.ctx.currentTime + 0.25) {
        this.playBeat(m, m.next, spb);
        m.next += spb;
        m.beat += 1;
      }
    }, 50);
    this.music = m;
  }

  playBeat(m, t, spb) {
    const { theme } = m;
    const bar = Math.floor(m.beat / 4) % theme.chords.length;
    const beat = m.beat % 4;
    const chord = theme.chords[bar];
    const nextRoot = theme.chords[(bar + 1) % theme.chords.length][0];
    // Walking bass: root, fifth, octave, then a step into the next chord.
    const walk = [chord[0], chord[0] + 7, chord[0] + 12, nextRoot + (Math.random() < 0.5 ? -1 : 1)];
    this.pluck(walk[beat] - 24, t, spb * 0.95);
    // Brushes on 2 and 4, a ghost note on the swung "and" of 4.
    if (beat === 1 || beat === 3) this.brush(t, 0.05);
    if (beat === 3) this.brush(t + spb * 0.66, 0.02);
    // Piano: a rolled chord at the top of every other bar, a few lonely notes in between.
    if (beat === 0 && (Math.floor(m.beat / 4) % 2 === 0 || theme.dense)) {
      chord.slice(1).forEach((n, i) => this.piano(n, t + i * 0.035, 3.2, 0.05));
    }
    if (beat === 2 && Math.random() < theme.melody) {
      const n = Phaser.Utils.Array.GetRandom(theme.scale) + 12;
      this.piano(n, t + (Math.random() < 0.5 ? 0 : spb * 0.66), 2.2, 0.06);
    }
  }

  hz(midi) { return 440 * 2 ** ((midi - 69) / 12); }

  piano(midi, t, len, vol) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
    [['triangle', 0], ['sine', 3]].forEach(([type, cents]) => {
      const o = ctx.createOscillator();
      o.type = type; o.frequency.value = this.hz(midi); o.detune.value = cents;
      o.connect(lp); o.start(t); o.stop(t + len + 0.05);
    });
    lp.connect(g).connect(this.music.bus);
  }

  pluck(midi, t, len) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = 'triangle'; o.frequency.value = this.hz(midi);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.32, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(lp).connect(g).connect(this.music.bus);
    o.start(t); o.stop(t + len + 0.05);
  }

  brush(t, vol) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    src.connect(bp).connect(g).connect(this.music.bus);
    src.start(t, Math.random() * 2); src.stop(t + 0.2);
  }

  // ---------- café: murmured voices and the odd cup, louder as you get closer ----------

  setCafe(level) {
    if (!this.ctx) return;
    if (!this.cafe) this.startCafe();
    this.cafe.gain.setTargetAtTime(level * 0.11, this.ctx.currentTime, 0.4);
  }

  startCafe() {
    const ctx = this.ctx;
    const gain = ctx.createGain(); gain.gain.value = 0;
    gain.connect(this.switch);
    // Voices: noise through two "vowel" bands, each pulsing at a talking rhythm.
    [[420, 4.1], [1100, 5.3], [760, 3.4]].forEach(([f, rate]) => {
      const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 2.2;
      const am = ctx.createGain(); am.gain.value = 0.5;
      const lfo = ctx.createOscillator(); lfo.frequency.value = rate;
      const depth = ctx.createGain(); depth.gain.value = 0.45;
      lfo.connect(depth).connect(am.gain);
      src.connect(bp).connect(am).connect(gain);
      src.start(0, Math.random() * 2); lfo.start();
      // Drift the band and rhythm so it never sounds like a loop.
      setInterval(() => {
        const now = ctx.currentTime;
        bp.frequency.setTargetAtTime(f * (0.8 + Math.random() * 0.4), now, 0.3);
        lfo.frequency.setTargetAtTime(rate * (0.7 + Math.random() * 0.6), now, 0.5);
      }, 700);
    });
    // A cup on a saucer, every few seconds.
    const clink = () => {
      const t = ctx.currentTime + 0.05;
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 2300 + Math.random() * 1400;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.25, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g).connect(gain); o.start(t); o.stop(t + 0.3);
      setTimeout(clink, 2000 + Math.random() * 5000);
    };
    setTimeout(clink, 1500);
    this.cafe = gain;
  }
}

// MIDI notes. chords: [bass root, then piano voicing]. scale: notes for the odd melody line.
const THEMES = {
  // The title and the prologue: A minor, bittersweet.
  prologue: {
    bpm: 64, melody: 0.55, volume: 0.13,
    chords: [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [50, 53, 57, 60, 64], [52, 56, 59, 62, 65]],
    scale: [69, 71, 72, 74, 76, 77, 79],
  },
  // Chapter 1: D minor, uneasy.
  ch1: {
    bpm: 58, melody: 0.4, volume: 0.13,
    chords: [[50, 53, 57, 61, 64], [46, 50, 53, 56, 62], [52, 55, 58, 62, 65], [45, 49, 52, 55, 58]],
    scale: [62, 64, 65, 67, 69, 70, 73],
  },
  // Chapter 2: E minor, a sad festival waltz feel in 4.
  ch2: {
    bpm: 70, melody: 0.6, volume: 0.12, dense: true,
    chords: [[52, 55, 59, 62, 66], [48, 52, 55, 59, 64], [45, 48, 52, 55, 60], [47, 51, 54, 57, 60]],
    scale: [64, 66, 67, 69, 71, 72, 74],
  },
};
