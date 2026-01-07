// script.js
const WORDS_JSON = 'words.json';    // path to your JSON
const THRESHOLD  = 250;             // only use the first THRESHOLD words

let wordsPool = [];
let rusKey, meaningKey, exampleKey;

async function loadWords() {
  const res = await fetch(WORDS_JSON);
  const all = await res.json();
  wordsPool = all.slice(0, THRESHOLD);

  const sample   = wordsPool[0];
  const goodKeys = Object.keys(sample).filter(k => sample[k] !== null && sample[k] !== '');
  [rusKey, meaningKey, exampleKey] = goodKeys;

  showRandomWord();
}

function showRandomWord() {
  if (!wordsPool.length) return;

  const entry = wordsPool[Math.floor(Math.random() * wordsPool.length)];
  const rus     = entry[rusKey]     || '';
  const meaning = entry[meaningKey] || '';
  let example   = entry[exampleKey] || '';
  example = example.replace(/\|/g, ' — ');

  document.getElementById('word').textContent    = rus;
  document.getElementById('meaning').textContent = meaning;
  document.getElementById('example').textContent = example;
}

window.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    showRandomWord();
  }
});

window.addEventListener('wheel', e => {
  if (e.deltaY > 0) showRandomWord();
});

let touchStartY = 0;

window.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
  }
});

window.addEventListener('touchend', e => {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  if (deltaY > 30) {
    // Swipe up
    showRandomWord();
  }
});

loadWords().catch(err => {
  document.getElementById('word').textContent = 'Error loading words';
  console.error(err);
});

