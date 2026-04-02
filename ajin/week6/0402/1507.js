const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const roads = []
for (let i = 1; i <= N; i++) {
  roads.push(input[i].split(' ').map(Number))
}

console.log(floyd_warshall())

function floyd_warshall() {
  let sum = 0

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      let used = true
      for (let k = 0; k < N; k++) {
        if (i === k || j === k) continue
        
        if (roads[i][k] + roads[k][j] < roads[i][j]) {
          return -1
        }

        if (roads[i][k] + roads[k][j] === roads[i][j]) {
          used = false
        }
      }

      if (used) sum += roads[i][j]
    }
  }

  return sum
}