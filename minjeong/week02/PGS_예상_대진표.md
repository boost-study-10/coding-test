### 📖 풀이한 문제

- 프로그래머스 예상 대진표 - 문제 이름
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/12985
- 난이도: Lv.2
- 걸린 시간: 20분

### 🧩 풀이 설계 / 막힌 부분

- 처음 접근 아이디어:
  - 토너먼트에서 인접한 두 번호가 한 경기를 치르면, 승자는 다음 라운드에서 현재 번호를 2로 나누고 올림한 번호 받게 된다.
  - 다음 라운드에서 배정받을 번호가 같아지는 순간이 바로 두 사람이 맞붙는 라운드이다.

- 고려한 시간복잡도: O(logN)
- 막힌 부분 / 해결 방법: 수식 세우기

### ⭐️ 문제에서 주로 사용한 알고리즘

## 시뮬레이션

### 🧠 대략적인 코드 설명

```js
function nextUniformNumber(number) {
  return Math.ceil(number / 2);
}

function solution(n, a, b) {
  let round = 0;
  let playerA = a;
  let playerB = b;

  while (playerA !== playerB) {
    playerA = nextUniformNumber(playerA);
    playerB = nextUniformNumber(playerB);
    round += 1;
  }

  return round;
}
```

-
