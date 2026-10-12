const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Builds one multiple-choice question about `word`, with 2 distractors from the same topic.
// Types: fr2en (meaning), en2fr (translation), listen (hear it, pick the French spelling).
export function makeQuestion(word, topicWords, { forceType = null, canListen = false } = {}) {
  const types = ['fr2en', 'en2fr', ...(canListen ? ['listen'] : [])];
  const type = forceType || types[Math.floor(Math.random() * types.length)];
  const others = shuffle(topicWords.filter((w) => w !== word && w.en !== word.en)).slice(0, 2);
  const options = shuffle([word, ...others]);
  const showFr = type !== 'fr2en';

  const q = {
    type,
    word,
    choices: options.map((o) => (showFr ? o.fr : o.en)),
    answer: options.indexOf(word),
    reveal: `« ${word.fr} » = ${word.en}`,
    speak: null,
  };
  if (type === 'fr2en') {
    q.prompt = `Que veut dire « ${word.fr} » ?`;
    q.sub = 'What does it mean?';
    q.speak = word.fr;
  } else if (type === 'en2fr') {
    q.prompt = `Comment dit-on « ${word.en} » ?`;
    q.sub = 'How do you say it in French?';
  } else {
    q.prompt = 'Écoute ! Quel mot entends-tu ?';
    q.sub = 'Listen! Which word do you hear?';
    q.speak = word.fr;
  }
  return q;
}
