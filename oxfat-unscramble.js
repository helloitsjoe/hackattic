const fs = require('fs');

function unscramble() {
  const dict = fs.readFileSync('./dictionary.txt', 'utf-8');
  const words = dict.split('\n');
  const sorted = words.map((word) => word.split('').sort().join(''));

  // const wordsToUnscramble = 'masmei;ixamme;ineram;vpamrie';
  const wordsToUnscramble =
    'uiimtnmgant;rosethilam;eeecebhss;sexutaic;duydd;esnaavsc;cimnamhse;ohsteangp;oesldacrn;nsdsetrivmee';
  // sammie;maxime;marine;vampire

  const unscrambled = wordsToUnscramble
    .split(';')
    .map((scramWord) => {
      const unscram = scramWord.split('').sort().join('');
      const idx = sorted.indexOf(unscram);
      return words[idx];
    })
    .join(';');

  console.log('unscrambled', unscrambled);
}

unscramble();
