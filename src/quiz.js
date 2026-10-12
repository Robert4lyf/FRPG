import { VOCAB } from './data/vocab.js';

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Builds a 3-option multiple-choice question from one topic.
// Randomly asks French -> English or English -> French.
export function makeQuestion(topic) {
  const pool = VOCAB[topic];
  const item = pick(pool);
  const toEnglish = Math.random() < 0.5;
  const options = shuffle([item, ...shuffle(pool.filter((w) => w !== item)).slice(0, 2)]);
  return {
    prompt: toEnglish
      ? `Que veut dire « ${item.fr} » ?`
      : `Comment dit-on « ${item.en} » en français ?`,
    choices: options.map((o) => (toEnglish ? o.en : o.fr)),
    answer: options.indexOf(item),
    explain: `« ${item.fr} » = ${item.en}`,
  };
}
