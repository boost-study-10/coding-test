const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

class PriorityQueue{
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

const [V, E] = input[0].split(' ').map(Number)
const K = Number(input[1])

const graph = Array.from({ length: V + 1 }, () => [])
for (let i = 2; i < E + 2; i++) {
  const [u, v, w] = input[i].split(' ').map(Number)
  graph[u].push([v, w])
}

const answer = dijkstra()
  .map((value) => {
    if (value === Infinity) return 'INF'
    return value
  })
console.log(answer.join('\n'))

function dijkstra() {
  const visited = Array.from({ length: V + 1 }, () => Infinity)
  const queue = new PriorityQueue()

  visited[K] = 0
  queue.push([0, K])

  while(queue.size()) {
    const [cost, node] = queue.pop()

    for (const [nextNode, nextCost] of graph[node]) {
      if (visited[nextNode] <= cost + nextCost) continue

      visited[nextNode] = cost + nextCost
      queue.push([visited[nextNode], nextNode])
    }
  }

  return visited.slice(1)
}