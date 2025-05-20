[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gFPznrUY)


<div align="center">
<img width="1079" alt="image" src="https://github.com/kookmin-sw/capstone-2025-25/blob/develop/frontend/src/assets/logo.svg" />

</div>

### 1. 서비스 한 줄 소개
쏟아지는 생각 속에서 나만의 흐름을 정리해주는 서비스 "Bubble-pop"

### 2. 서비스 소개 페이지
https://kookmin-sw.github.io/capstone-2025-25/

### 3. 서비스 URL
https://www.bubble-pop.kr

### 4. 팀원 소개

<div>
  
|<img src="https://avatars.githubusercontent.com/u/84188904?v=4" width="150" height="150">|<img src="https://avatars.githubusercontent.com/u/66055587?v=4" width="150" height="150">|<img src="https://avatars.githubusercontent.com/u/105338882?v=4" width="150" height="150">|<img src="https://avatars.githubusercontent.com/u/65989284?v=4" width="150" height="150">|<img src="https://avatars.githubusercontent.com/u/100904133?v=4" width="150" height="150">|<img src="https://avatars.githubusercontent.com/u/87667113?v=4" width="150" height="150">|
| :---: | :---: | :---: | :---: | :---: | :---: |
| **이보현** | **최유찬** | **조다운** | **류건** | **유다영** | **김도훈** |
| frontend | frontend | frontend | backend | backend | backend |
| ****3038 | ****2000 | ****3139 | ****3103 | ****3027 | ****2208 |
</div>

### 5. 개발 환경 설정법
1. **프로젝트 클론**
```
git clone https://github.com/kookmin-sw/capstone-2025-25.git
cd capstone-2025-25
```

2. **백엔드 개발 환경 설정 (Spring Boot, Java)**
   1. 필수 소프트웨어
      - JDK 17
      - Gradle 7.x 이상
      - PostgreSQL (로컬 개발 시)
      - Docker (선택, DB 등 컨테이너 실행용)
        
    2. 설정 파일 준비
     ```
     # backend/src/main/resources/application-*.yml 파일을 복사 후 값 입력
     cp backend/src/main/resources/application-*.yml backend/src/main/resources/application-*.yml
    ```
     
    3. 서버 실행
     ```
     cd backend
     ./gradlew bootRun
     ```

3. **프론트엔드 개발 환경 설정 (React)**
   1. 필수 소프트웨어
      - Node.js 18.x 이상
      - npm
        
    2. 패키지 설치
     ```
     cd ../frontend
     npm install
     ```
     
    3. 환경 변수 파일(.env) 작성
      .env 파일을 생성하고, API 서버 주소 등 환경 변수 입력

    4. 개발 서버 실행
      ```
       npm start
      ```

<br/> 

![서비스 소개서 최종](https://github.com/user-attachments/assets/8c9d0cd1-5f7a-4428-8cba-b3433bc5e56d)


