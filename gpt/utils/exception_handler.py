from fastapi import HTTPException
from typing import Callable, Awaitable, TypeVar
import functools

T = TypeVar("T")

def safe_gpt_handler(func: Callable[..., Awaitable[T]]) -> Callable[..., Awaitable[T]]:
    @functools.wraps(func)
    async def wrapper(*args, **kwargs) -> T:
        try:
            return await func(*args, **kwargs)
        except HTTPException:
            raise  # 기존 HTTP 예외는 그대로 전달
        except Exception as e:
            # 여기서 로깅이나 에러 메시지 포맷팅 추가 가능
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    return wrapper
