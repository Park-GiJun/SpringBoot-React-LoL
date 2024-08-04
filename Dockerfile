# 백엔드를 위한 빌드 스테이지
FROM openjdk:21-slim as backend-build
WORKDIR /app
COPY . .
RUN ./gradlew build -x test

# 프론트엔드를 위한 빌드 스테이지
FROM node:21 as frontend-build
WORKDIR /app
COPY frontend .
RUN npm ci && npm run build

# 최종 이미지
FROM openjdk:21-slim
WORKDIR /app
COPY --from=backend-build /app/build/libs/*.jar app.jar
COPY --from=frontend-build /app/build /app/frontend/build
EXPOSE 9832

# 로그 디렉토리 생성
RUN mkdir -p /app/logs

# 애플리케이션 실행 및 로그 리다이렉션
CMD java -jar app.jar > /app/logs/app.log 2>&1