import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# OpenAI API 키 불러오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# CORS 허용할 도메인 불러오기
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")