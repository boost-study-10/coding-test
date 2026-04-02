const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin': __dirname + '/input.txt').toString().split('\n')

class PriorityQueue {
  constructor() {
    this.queue = []
  }

  size() {
    return this.queue.length
  }

  push(value) {
    this.queue.push(value)
    this.#moveUp()
  }

  pop() {
    if (!this.size()) return undefined
    if (this.size() === 1) return this.queue.pop()

    const value = this.queue[0]
    this.queue[0] = this.queue.pop()
    this.#moveDown()

    return value
  }

  #swap(a, b) {
    [this.queue[a], this.queue[b]] = [this.queue[b], this.queue[a]]
  }

  #moveUp() {
    let index = this.size() - 1

    while(index) {
      const pIndex = Math.floor((index - 1) / 2)

      if (this.queue[pIndex][0] <= this.queue[index][0]) break

      this.#swap(index, pIndex)
      index = pIndex
    }
  }

  #moveDown() {
    let index = 0

    while(true) {
      const left = index * 2 + 1
      const right = index * 2 + 2

      if (this.size() <= left) break

      const sIndex = right < this.size() && this.queue[right][0] < this.queue[left][0] ? right : left

      if (this.queue[index][0] <= this.queue[sIndex][0]) break

      this.#swap(index, sIndex)
      index = sIndex
    }
  }
}

const [N, M, X] = input[0].split(' ').map(Number)
const graph = Array.from({ length: N + 1 }, () => [])
for (let i = 1; i < M + 1; i++) {
  const [a, b, t] = input[i].split(' ').map(Number)
  graph[a].push([b, t])
}

const result = []
for (let i = 1; i <= N; i++) {
  result.push(toX(i) + fromX(i))
}
result.sort((a, b) => b - a)
console.log(result[0])


function toX(start) {
  const visited = Array.from({ length: N + 1}, () => Infinity)
  const queue = new PriorityQueue()

  visited[start] = 0
  queue.push([0, start])

  while(queue.size()) {
    const [time, node] = queue.pop()
    if (visited[node] < time) continue

    for (const [nextNode, nextTime] of graph[node]) {
      if (visited[nextNode] <= time + nextTime) continue

      visited[nextNode] = time + nextTime
      queue.push([visited[nextNode], nextNode])
    }
  }

  return visited[X]
}

function fromX(end) {
  const visited = Array.from({ length: N + 1}, () => Infinity)
  const queue = new PriorityQueue()

  visited[X] = 0
  queue.push([0, X])

  while(queue.size()) {
    const [time, node] = queue.pop()
    if (visited[node] < time) continue

    for (const [nextNode, nextTime] of graph[node]) {
      if (visited[nextNode] <= time + nextTime) continue

      visited[nextNode] = time + nextTime
      queue.push([visited[nextNode], nextNode])
    }
  }

  return visited[end]
}
