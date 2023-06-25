// === Challenge 19 ===
// const nums = [
//   ['a', 'b', 'c'],
//   ['d', 'e', 'f'],
//   ['g', 'h', 'i'],
//   ['j', 'k', 'l'],
//   ['m', 'n', 'o'],
//   ['p', 'q', 'r', 's'],
//   ['t', 'u', 'v'],
//   ['w', 'x', 'y', 'z'],
// ];

// const string = '69a40a4c56c982d787d35b8293f28660';

// const sum = string.split('').reduce((a, char) => {
//   if (Number(char) === Number(char)) {
//     return a + Number(char);
//   }

//   const rowIdx = nums.findIndex((row) => row.includes(char));
//   const charIdx = nums[rowIdx].indexOf(char);

//   const rowCode = rowIdx + 2;
//   return a + rowCode * (charIdx + 2);
// }, 0);

// console.log(sum);

// === Challenge 20 ===

const crypto = require('crypto');
const fs = require('fs');
const cluster = require('cluster');
const os = require('os');

const wordlist = fs.readFileSync('./wordlist.txt').toString().split('\n');
console.log('wordlist.length', wordlist.length);

if (cluster.isPrimary) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork({ INDEX: i });
  }

  // cluster.on('exit', (worker) => {
  //   const INDEX = worker.process.env.INDEX;
  //   console.log('exited');
  //   cluster.fork({ INDEX });
  // });
} else {
  const { INDEX } = process.env;
  const offset = Math.floor(wordlist.length / 8);
  const start = Math.floor(offset * INDEX);
  const end = start + offset;
  console.log(INDEX, 'start', start);
  console.log(INDEX, 'end', end);

  (() => {
    for (let i = end; i >= start; i--) {
      const word1 = wordlist[i];
      console.log('word1', word1);
      for (let j = wordlist.length; j >= 0; j--) {
        const word2 = wordlist[j];

        // console.log('word1 + word2', word1 + word2);

        const hash = crypto
          .createHash('md5')
          .update(word1 + word2)
          .digest('hex');

        if (hash === 'df6acb722be001fb293fb282e488c496') {
          console.log('The words are:', word1 + word2);
          return;
        }
      }
    }
  })();
}
// console.log('hash', hash);
