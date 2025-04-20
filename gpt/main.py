from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS
from routes import gpt_router
from utils.logging import setup_logging

app = FastAPI()

app.include_router(gpt_router.router, prefix="/api/gpt")

# CORS 설정 적용
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # 허용할 출처 리스트
    allow_credentials=True,  # 쿠키 포함 허용 (JWT 인증 사용 시 필요)
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, PUT, DELETE 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# 로깅 설정
logger = setup_logging()


# 요청 실행 시간 로깅 미들웨어
@app.middleware("http")
async def log_request_time(request: Request, call_next):
    import time
    start_time = time.time()  # 시작 시간 기록
    response = await call_next(request)  # API 실행
    process_time = time.time() - start_time  # 실행 시간 계산
    logger.info(f"⏱ API 요청: {request.url} - 실행 시간: {process_time:.3f}초")
    return response
