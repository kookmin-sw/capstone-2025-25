import logging
from fastapi import FastAPI, Request
from routes import gpt
from utils.logging import setup_logging

app = FastAPI()

# 로깅 설정
logger = setup_logging()

# 엔드포인트 등록
app.include_router(gpt.router)

# 요청 실행 시간 로깅 미들웨어
@app.middleware("http")
async def log_request_time(request: Request, call_next):
    import time
    start_time = time.time()  # 시작 시간 기록
    response = await call_next(request)  # API 실행
    process_time = time.time() - start_time  # 실행 시간 계산
    logger.info(f"⏱ API 요청: {request.url} - 실행 시간: {process_time:.3f}초")
    return response