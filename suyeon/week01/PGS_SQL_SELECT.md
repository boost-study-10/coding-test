### 📖 풀이한 문제
- 프로그래머스 SQL_SELECT
- 문제 링크: https://school.programmers.co.kr/learn/courses/30/parts/17042

### 평균 일일 대여 요금 구하기
```sql
SELECT ROUND(AVG(DAILY_FEE)) AS AVERAGE_FEE FROM CAR_RENTAL_COMPANY_CAR
WHERE CAR_TYPE = 'SUV';
```

### 인기있는 아이스크림
```sql
SELECT FLAVOR FROM FIRST_HALF
ORDER BY TOTAL_ORDER DESC, SHIPMENT_ID;
```

### 조건에 맞는 도서 리스트 출력하기
```sql
SELECT BOOK_ID, DATE_FORMAT(PUBLISHED_DATE, '%Y-%m-%d') AS PUBLISHED_DATE FROM BOOK
WHERE YEAR(PUBLISHED_DATE) = '2021' AND CATEGORY = '인문'
ORDER BY PUBLISHED_DATE;
```