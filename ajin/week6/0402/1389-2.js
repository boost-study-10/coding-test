const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [N, M] = input[0].split(' ').map(Number)

const kevin_bacon = Array.from({ length: N + 1 }, () => Array.from({ length: N + 1 }, () => Infinity))
for (let i = 1; i <= M; i++) {
  const [A, B] = input[i].split(' ').map(Number)
  kevin_bacon[A][B] = kevin_bacon[B][A] = 1
}

for (let i = 1; i <= N; i++) {
  kevin_bacon[i][i] = 0
}

floyd_warshall()

let answer = { cnt: Infinity, number: 0 }
for (let i = 1; i <= N; i++) {
  const cnt = kevin_bacon[i].slice(1).reduce((a, b) => a + b, 0)
  
  if (cnt < answer.cnt) {
    answer = { cnt, number: i}
  }
}
console.log(answer.number)

function floyd_warshall() {
  for (let k = 1; k <= N; k++) {
    for (let i = 1; i <= N; i++) {
      for (let j = 1; j <= N; j++) {
        kevin_bacon[i][j] = Math.min(kevin_bacon[i][k] + kevin_bacon[k][j], kevin_bacon[i][j])
      }
    }
  }
}