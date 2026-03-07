### 📖 풀이한 문제

- 백준 1987 - 알파벳
- 문제 링크: https://www.acmicpc.net/problem/1987
- 난이도: gold4
- 걸린 시간: 30m

### 🧩 풀이 설계 / 막힌 부분

- 처음 접근 아이디어: dfs, 백트래킹
- 고려한 시간복잡도:
- 막힌 부분
  - 파이썬으로 풀 때 `set+dfs`는 시간초과가 났다.
  - 시간복잡도는 비트마스킹과 같게 계산되지만, 내부적으로 해시 계산(해시테이블 위치 찾기, bucket lookup, 문자열 비교) 연산이 일어나기 때문이다. 대신 비트마스킹으로 cpu 비트 연산 한번으로 끝내버리는 방법으로 풀이했었다.
  - js의 set은 어떨까? 물론 js의 set도 해시기반이긴 하다. 그래서 내부적으로 같은 연산 과정을 거친다. 하지만 js엔진(v8)의 최적화를 믿었다. JIT를 사용하니까 `set.has()`같은 반복 연산이 매우 많이 호출되면 기계어로 최적화될 것이라 생각했다. (파이썬은 인터프리터 실생이라서 반복 연산에서 상대적으로 느림)
  - 하지만.. v8은 내 기대를 저버렸다. 같은 방식으로는 js에서도 시간초과 났다 쌰갈 (아마 c++이나 자바에서는 해당 방식들이 당연히 통과될 거라고 생각한다 ㅋ 근데 못함...)
- 해결 방법
  - 이번에는 비트마스킹 말고 다른 방식을 사용했다. 사실 될지 안될지 몰라서 실험을 해봤다.
  - set으로 방문확인을 할 때는 `set.has()`를 사용했다. 비트마스킹에서는 `visited & mask` 비트 연산을 사용했다. 이번에는 배열을 사용해보려 한다. `visited[idx]`
  - 사실 위 세 방식 모두 이론적으로 시간복잡도는 O(1)로 굉장히 합리적이다. 하지만 실제 연산 비용이 다르다. set은 해시계산, 비트마스킹은 cpu연산 한두개, 배열은 그 사이 어딘가이다.. 그래서 이 배열방법이 과연 통과할까 궁금했다.
  - 비트마스킹과 배열, 어떤 차이가 있을까? 비트마스킹은 사실 백트래킹이 필요없다(새로운 숫자가 만들어지고 원래 값은 보존) 근데 배열은 set처럼 참조로 전달되고 같은 배열을 공유하기 때문에 백트래킹을 해줘야 해서 상태복사비용이 발생한다.. 그리고 메모리도 비트마스크는 정수 하나로 해결 가능한데 배열은 알파벳 26개를 위한 최소 26칸 배열이 필요하다. cache locality가 안좋다는 뜻이다..
  - 나는 `{'a':0, 'b':1, 'c':2, ...}` 같은 map을 만들고 그 map을 통해서 인덱스를 찾아서 배열에 해당 인덱스로 접근하는 방식으로 풀어보았다. 사실 map을 직접 만들 필요는 없고 알파벳은 이미 ascii연속이고 `'A' = 65` 이니까 `board[i][j].charCodeAt(0) - 65` 이런식으로 쓰면 된다. 이게 map lookup보다 연산량이 적으니까 훨씬 빠를 것이다. 근데 이렇게 안쓰고 풀어봤다.
  - 아 그리고 `const visited = new Array(26).fill(false)` 이렇게 썼는데, `const visited = new Uint8Array(26)` 이걸로 쓰면 좀 더 빠르다. 둘 다 길이 26 배열처럼 쓰이긴 하지만, 전자는 일반 js배열로 값 타입이 자유고 js엔진이 동적으로 관리하는 메모리 구조가 느슨한 그 배열이다. 후자는 TypedArray로 c언어 스타일 고정 배열이다. 초기값은 모든 요소가 0인데, 값은 0~256만 가능하다. 그래서 방문체크할 때 쓰면 false, true가 아니라 0,1로 해야한다. 그리고 연속된 메모리라서 좀 더 빠를 가능성이 높음

### ⭐️ 문제에서 주로 사용한 알고리즘

- dfs, 백트래킹

### 🧠 대략적인 코드 설명

- Javascript

```
const fs = require("fs");

const input = fs
  .readFileSync(process.platform === "linux" ? "/dev/stdin" : "input.txt")
  .toString()
  .trim()
  .split("\n");

const [r, c] = input[0].split(" ").map(Number);
const board = [];
for (let i = 1; i <= r; i++) {
  board.push(input[i].split(""));
}

function dfs(i, j, stack, r, c, board) {
  const dirs = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  result = stack.size;

  for (const [di, dj] of dirs) {
    const ni = i + di,
      nj = j + dj;

    if (0 > ni || ni >= r || nj < 0 || nj >= c) continue;
    if (stack.has(board[ni][nj])) continue;

    stack.add(board[ni][nj]);
    result = Math.max(result, dfs(ni, nj, stack, r, c, board));
    stack.delete(board[ni][nj]);
  }

  return result;
}

function solution(r, c, board) {
  const stack = new Set();
  stack.add(board[0][0]);
  return dfs(0, 0, stack, r, c, board);
}

console.log(solution(r, c, board));

```
