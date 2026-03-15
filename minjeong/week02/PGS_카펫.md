### 📖 풀이한 문제

- 프로그래머스 카펫
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/42842
- 난이도: Lv.2
- 걸린 시간: 20m

### 🧩 풀이 설계 / 막힌 부분

- **처음 접근 아이디어**

1. 갈색과 노란색 격자의 총합을 구한다.
2. 이 합이 될 수 있는 직사각형의 가로, 세로 길이를 찾는다.
3. 카펫의 최소 높이가 3이며, 가로와 세로 후보군을 탐색한다.

- **고려한 시간복잡도:** O(N)
- **막힌 부분 / 해결 방법:** `(row - 2) * (col - 2)`가 `yellow`와 같은지 체크하는 수식 세우기

### ⭐️ 문제에서 주로 사용한 알고리즘

- **완전 탐색 (Brute Force)**
- **수학 (약수 활용)**

### 🧠 대략적인 코드 설명

```js
function solution(brown, yellow) {
  const total = brown + yellow;
  const arr = [];

  for (let row = 3; row <= total; row++) {
    if (total % row !== 0) continue;
    const col = total / row;
    if (row < col) continue;

    if ((row - 2) * (col - 2) === yellow) {
      return [row, col];
    }
  }
}
```
