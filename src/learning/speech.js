// French text-to-speech using the browser's built-in voices (no network or API needed).
const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voice = null;
let enabled = true;

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  voice = voices.find((v) => v.lang === 'fr-FR')
    || voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('fr'))
    || null;
}

if (supported) {
  pickVoice();
  window.speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export const speech = {
  // True when a French voice is installed, so listening questions make sense.
  get available() {
    return supported && !!voice;
  },
  setEnabled(on) {
    enabled = on;
    if (!on && supported) window.speechSynthesis.cancel();
  },
  speak(text) {
    if (!supported || !enabled || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    if (voice) u.voice = voice;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  },
};
