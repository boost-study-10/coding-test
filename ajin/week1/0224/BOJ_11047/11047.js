const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, k] = input.shift().split(' ').map(Number)
const coins = input.map(Number).sort((a, b) => b - a)

let money = k
let answer = 0
for (let coin of coins) {
  if (!money || money < coin) continue

  const cnt = Math.floor(money / coin)
  answer += cnt
  money -= coin * cnt
}
console.log(answer)