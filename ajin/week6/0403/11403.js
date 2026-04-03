const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const N = Number(input[0])
const graph = []
for (let i = 1; i < N + 1; i++) {
  graph.push(input[i].split(' ').map(Number))
}

for (let k = 0; k < N; k++) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (graph[i][k] && graph[k][j]) {
        graph[i][j] = 1
      }
    }
  }
}
graph.map((v) => console.log(v.join(' ')))