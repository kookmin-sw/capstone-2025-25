FROM openjdk:17-jdk-slim

# 서울 시간대 설정
ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata && \
    ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean

WORKDIR /app

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
