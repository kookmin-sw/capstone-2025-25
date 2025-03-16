# Python 3.10 기반 이미지 사용
FROM python:3.10

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 프로젝트 파일 복사
COPY . .

# Uvicorn 실행 (Docker 컨테이너 내부에서 실행)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]