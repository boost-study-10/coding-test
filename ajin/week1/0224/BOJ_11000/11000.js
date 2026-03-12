class PriorityQueue {
  constructor() {
    this.queue = []
  }

  top() {
    return this.queue[0]
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

      const top = this.queue[0]
      this.queue[0] = this.queue.pop()
      this.#moveDown()
      
      return top
  }

  #moveUp() {
    let index = this.size() - 1
    const element = this.queue[index]

    while(index) {
      const parentIndex = Math.floor((index - 1) / 2)
      const parent = this.queue[parentIndex]

      if (parent <= element) break

      this.queue[index] = parent
      index = parentIndex
    }

    this.queue[index] = element
  }

  #moveDown() {
    let index = 0
    const element = this.queue[index]

    while(true) {
      let left = index * 2 + 1
      let right = index * 2 + 2
      let swap = null

      if (left < this.size()) {
        if (this.queue[left] < element) swap = left
      }

      if (right < this.size()) {
        if ((swap === null && this.queue[right] < element) || (swap !== null && this.queue[right] < this.queue[left])) swap = right
      }

      if (swap === null) break

      this.queue[index] = this.queue[swap]
      index = swap
    }

    this.queue[index] = element
  }
}

const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().trim().split('\n')

const n = Number(input.shift())
const time_table = input
  .map((line) => line.split(' ').map(Number))
  .sort((a, b) => {
    if (a[0] === b[0]) return a[1] - b[1]
    return a[0] - b[0]
  })

const queue = new PriorityQueue()
for (const [start, end] of time_table) {
  const class_time = queue.top()
  if (class_time <= start) {
    queue.pop()
  }

  queue.push(end)
}

console.log(queue.size())