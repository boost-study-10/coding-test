const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

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

const n = Number(input[0])
const m = Number(input[1])
const bus = Array.from({ length: n + 1 }, () => [])
for (let i = 2; i < m + 2; i++) {
  const [a, b, c] = input[i].split(' ').map(Number)
  bus[a].push([b, c])
}
const [start, end] = input[m + 2].split(' ').map(Number)

const visited = Array(n + 1).fill(Infinity)
const queue = new PriorityQueue()
const parent = Array(n + 1).fill(0)

visited[start] = 0
queue.push([0, start])

while(queue.size()) {
  const [cost, city] = queue.pop()
  if (visited[city] < cost) continue
  
  for (const [next_city, next_cost] of bus[city]) {
    if (visited[next_city] <= cost + next_cost) continue
    
    visited[next_city] = cost + next_cost
    queue.push([visited[next_city], next_city])
    parent[next_city] = city
  }
}

const path = track_visited(parent)
console.log(visited[end])
console.log(path.length)
console.log(path.join(' '))

function track_visited(parent) {
  let child = end
  const result = [end]

  while(child !== start) {
    result.push(parent[child])
    child = parent[child]
  }

  return result.reverse()
}