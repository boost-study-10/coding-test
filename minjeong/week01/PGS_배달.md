### 📖 풀이한 문제

- 프로그래머스 배달 - 문제 이름
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/12978?language=javascript
- 난이도: lv2
- 걸린 시간:

### 🧩 풀이 설계 / 막힌 부분

- 처음 접근 아이디어:

> [!NOTE]
> 완전탐색하되 짧은 것 기준으로 탐색한다.

- 고려한 시간복잡도: O(N x road.length)
- 막힌 부분 / 해결 방법:
  제 손으로 직접 코드를 짜본게 너무 오랜만이라
  구현 흐름은 떠올라도 그래프 만들고 반복문 돌리는게 너무 헷갈리네요...

### ⭐️ 문제에서 주로 사용한 알고리즘

완전탐색 , 다익스트라

-

### 🧠 대략적인 코드 설명

```js
function solution(N, road, K) {
  const graph = Array.from({ length: N + 1 }, () => []);
  for (const [a, b, c] of road) {
    graph[a].push({ to: b, dist: c });
    graph[b].push({ to: a, dist: c });
  }

  const dists = Array(N + 1).fill(Infinity);
  dists[1] = 0;

  const q = [1];

  while (q.length > 0) {
    const current = q.shift();

    graph[current].forEach((next) => {
      // 현재까지 거리 + 다음 마을까지 거리 < 기존에 기록된 거리
      if (dists[next.to] > dists[current] + next.dist) {
        dists[next.to] = dists[current] + next.dist;
        q.push(next.to);
      }
    });
  }

  return dists.filter((d) => d <= K).length;
}
```

-
