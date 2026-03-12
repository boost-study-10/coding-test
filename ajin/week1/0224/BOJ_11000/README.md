### 📖 풀이한 문제

- 백준 11000 - 강의실 배정
- 문제 링크: https://www.acmicpc.net/problem/11000
- 난이도: 골드4
- 걸린 시간: 40분(우선순위큐 만드는데 30분...)

### ⭐️ 문제에서 주로 사용한 알고리즘

- 그리디
- 우선순위 큐

### 🧩 풀이 설계 / 코드 설명

#### 시간 복잡도

1. 부르트포스 → 불가능
   - N = 200,000일 때, 수업을 어떤 강의실에 배정할지 조합을 구하면 완전 불가능..
2. 그리디 + 우선순위큐 → 가능
   - 수업을 정렬하고 사용중인 강의실에 배정/새로운 강의실에 배정하기
   - 현재 수업을 배정하려면, 지금까지 배정된 강의실 중 가장 빨리 끝나는 수업의 종료 시간을 알아야 함
   - 배정된 강의실을 빠르게 조회/삭제/삽입하고자 우선순위큐 사용
     만약, 선형 탐색 시 O(N^2)로 불가능
   - 우선순위큐 연산: 조회(O(1)), push/pop(O(logN))
   - O(N logN) + O(N) + O(logN) + ... = O(N logN)

#### 설계

1. 수업을 시작 시간 오름차순으로 정렬
   - 시작 시간이 같으면 종료 시간 오름차순으로 정렬
2. 최소 힙에 배정된 강의실들의 종료 시간 저장
3. 수업을 순회하면서
4. (강의실 종료 시간인 힙의 최솟값 <= 현재 수업 시작 시간)이면 해당 강의실 사용 가능
   - 현재 수업의 종료 시간을 힙에 push
5. 모든 수업을 처리한 뒤, 힙에 남아있는 요소 개수가 강의실의 수

### 🗂️ 정리

#### 우선순위큐는 5분 이내로 만들어야한다!!!

```js
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  top() {
    return this.queue[0];
  }

  size() {
    return this.queue.length;
  }

  push(value) {
    this.queue.push(value);
    this.#moveUp();
  }

  pop() {
    if (!this.size()) return undefined;
    if (this.size() === 1) return this.queue.pop();

    const top = this.queue[0];
    this.queue[0] = this.queue.pop();
    this.#moveDown();

    return top;
  }

  #moveUp() {
    let index = this.size() - 1;
    const element = this.queue[index];

    while (index) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.queue[parentIndex];

      if (parent <= element) break;

      this.queue[index] = parent;
      index = parentIndex;
    }

    this.queue[index] = element;
  }

  #moveDown() {
    let index = 0;
    const element = this.queue[index];

    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let swap = null;

      if (left < this.size()) {
        if (this.queue[left] < element) swap = left;
      }

      if (right < this.size()) {
        if (
          (swap === null && this.queue[right] < element) ||
          (swap !== null && this.queue[right] < this.queue[left])
        )
          swap = right;
      }

      if (swap === null) break;

      this.queue[index] = this.queue[swap];
      index = swap;
    }

    this.queue[index] = element;
  }
}
```

#### 특정 문제는 입력 받을 때, trim() 처리 안하면 틀린다....
