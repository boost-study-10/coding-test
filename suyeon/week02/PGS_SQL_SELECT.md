### 📖 풀이한 문제
- 프로그래머스 SQL_SELECT
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/parts/17042

### 12세 이하인 여자 환자 목록 출력하기
```sql
SELECT PT_NAME, PT_NO, GEND_CD, AGE, IFNULL(TLNO, 'NONE') AS TLNO FROM PATIENT
WHERE AGE <= 12 AND GEND_CD = 'W'
ORDER BY AGE DESC, PT_NAME;
```

### 과일로 만든 아이스크림 고르기
```sql
SELECT A.FLAVOR FROM FIRST_HALF A LEFT OUTER JOIN ICECREAM_INFO B
    ON A.FLAVOR = B.FLAVOR
WHERE A.TOTAL_ORDER > 3000
    AND B.INGREDIENT_TYPE = 'fruit_based'
ORDER BY A.TOTAL_ORDER DESC;
```