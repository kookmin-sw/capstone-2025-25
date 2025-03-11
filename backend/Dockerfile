# JDK 17 Base Image 사용
FROM openjdk:17-jdk-slim

# 작업 디렉터리 설정
WORKDIR /app

# Gradle 빌드 후 생성된 JAR 복사
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

# 실행 권한 부여 (entrypoint.sh 스크립트 실행 가능하게 설정)
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 컨테이너 시작 시 실행할 명령어
ENTRYPOINT ["/entrypoint.sh"]
