const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const n = Number(input[0])
const m = Number(input[1])
const bus = Array.from({ length: n + 1 }, () => Array(n + 1).fill(Infinity))
for (let i = 2; i < m + 2; i++) {
  const [a, b, c] = input[i].split(' ').map(Number)
  bus[a][b] = Math.min(c, bus[a][b])
}

for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= n; j++) {
    if (i === j) bus[i][j] = 0
  }
}

for (let k = 1; k <= n; k++) {
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      if (i === k || j === k) continue

      bus[i][j] = Math.min(bus[i][k] + bus[k][j], bus[i][j])
    }
  }
}

for (let i = 1; i <= n; i++) {
  for (let j = 1; j <= n; j++) {
    if (bus[i][j] === Infinity) bus[i][j] = 0
  }
}

bus.slice(1).map((row) => console.log(row.slice(1).join(' ')))