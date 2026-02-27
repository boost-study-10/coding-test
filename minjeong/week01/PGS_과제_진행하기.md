### 📖 풀이한 문제

- 프로그래머스 과제 진행하기 - 문제 이름
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/lessons/176962
- 난이도:Lv.2
- 걸린 시간:

### 🧩 풀이 설계 / 막힌 부분

- 처음 접근 아이디어:

```text
1. 전처리 (Preprocessing)
   - 모든 시작 시각(start)을 계산하기 편하게 '분(minutes)' 단위로 환산한다.
   - 과제가 들어온 순서대로 처리하기 위해 시작 시간 기준으로 정렬한다.

2. 과제 수행 및 중단 결정 (Comparison)
   - (다음 과제 시작 시각 - 현재 과제 시작 시각)을 계산하여 '가용 시간'을 구한다.
   - 만약 (가용 시간 < 현재 과제 소요 시간)이라면,
     - 현재 과제를 다 못 끝내므로, 진행한 만큼 playtime을 차감한다.
     - 남은 과제 분량과 이름을 '스택(Stack)'에 담아둔다.
   - 그 외의 경우 (시간이 딱 맞거나 남는다면),
     - 현재 과제를 완료 처리하고 결과 배열(result)에 넣는다.

3. 남는 시간 활용 (Stack Processing)
   - 과제를 끝냈는데 다음 과제까지 시간이 남았다면,
     - 스택에서 가장 최근에 멈춘 과제를 꺼낸다.
     - 남은 시간 동안 그 과제를 이어서 진행한다.
     - 다 끝내면 결과에 넣고, 또 시간이 남으면 스택의 다음 과제를 확인한다.

4. 마무리 (Cleanup)
   - 준비된 모든 과제를 한 번씩 훑은 뒤에도 스택에 과제가 남아있다면,
     - 가장 최근에 멈춘 순서대로 하나씩 꺼내어 결과 배열에 담는다.
```

- 고려한 시간복잡도: O(NlogN)
- 막힌 부분 / 해결 방법:

```js
const sortedPlans = plans
  .map(([name, start, playtime]) => {
    const [h, m] = start.split(':').map(Number);
    return [name, h * 60 + m, Number(playtime)];
  })
  .sort((a, b) => a[1] - b[1]);
```

이 로직에서, `.map` 이후 `.sort` 하였기 때문에  
시간 복잡도가 N x NlogN 일거라고 생각하고 있었는데,
AI를 통해 물어본 결과 별개의 연산이란 부분이 놀라웠다.

여태까지 잘못 알고있었던 것 같다.

### ⭐️ 문제에서 주로 사용한 알고리즘

스택

-

### 🧠 대략적인 코드 설명

```js
function solution(plans) {
  const result = [];
  const stack = [];

  const sortedPlans = plans
    .map(([name, start, playtime]) => {
      const [h, m] = start.split(':').map(Number);
      return [name, h * 60 + m, Number(playtime)];
    })
    .sort((a, b) => a[1] - b[1]);

  for (let i = 0; i < sortedPlans.length; i++) {
    const [name, start, playtime] = sortedPlans[i];

    if (i === sortedPlans.length - 1) {
      result.push(name);
      break;
    }

    const nextStart = sortedPlans[i + 1][1];
    const timeGap = nextStart - start;

    if (playtime <= timeGap) {
      result.push(name);
      let remainingTime = timeGap - playtime;

      while (remainingTime > 0 && stack.length > 0) {
        const [sName, sTime] = stack.pop();
        if (sTime <= remainingTime) {
          result.push(sName);
          remainingTime -= sTime;
        } else {
          stack.push([sName, sTime - remainingTime]);
          remainingTime = 0;
        }
      }
    } else {
      stack.push([name, playtime - timeGap]);
    }
  }

  while (stack.length > 0) {
    result.push(stack.pop()[0]);
  }

  return result;
}
```

-
