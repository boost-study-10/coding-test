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

    const top = this.queue[0]
    this.queue[0] = this.queue.pop()
    this.#moveDown()
    
    return top
  }

  #swap(a, b) {
    [this.queue[a], this.queue[b]] = [this.queue[b], this.queue[a]]
  }

  #moveUp() {
    let index = this.size() - 1
    
    while(index) {
      const parentIndex = Math.floor((index - 1) / 2)
  
      if (this.queue[parentIndex] <= this.queue[index]) break

      this.#swap(index, parentIndex)
      index = parentIndex
    }
  }

  #moveDown() {
    let index = 0

    while(true) {
      const left = index * 2 + 1
      const right = index * 2 + 2

      if (this.size() <= left) break

      const swapIndex = right < this.size() && this.queue[right] < this.queue[left] ? right : left;

      if (this.queue[index] <= this.queue[swapIndex]) break

      this.#swap(index, swapIndex)
      index = swapIndex
    }
  }
}

const input = require('fs').readFileSync(process.platform === 'linux' ? '/dev/stdin' : __dirname + '/input.txt').toString().split('\n')

const [n, k] = input[0].split(' ').map(Number)

const jewels = []
for (let i = 1; i < n + 1; i++) {
  jewels.push(input[i].split(' ').map(Number))
}
jewels.sort((a, b) => {
  if (a[0] === b[0]) return a[1] - b[1]
  return a[0] - b[0]
})

const bags = []
for (let i = n + 1; i < n + k + 1; i++) {
  bags.push(Number(input[i]))
}
bags.sort((a, b) => a - b)

let answer = 0
const queue = new PriorityQueue()
let jewel_index = 0
for (const bag_m of bags) {
  while(jewel_index < n) {
    const [m, v] = jewels[jewel_index]
    if (m <= bag_m) {
      queue.push(-v)
      jewel_index++
    } else break
  }

  if (queue.size()) {
    const jewel = -queue.pop()
    answer += jewel
  }
}
console.log(answer)