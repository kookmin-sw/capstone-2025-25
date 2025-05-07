from datetime import datetime

from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.eisenhower_request import EisenhowerTaskRequest
from models.eisenhower_response import EisenhowerRecommendationResponse
from services.gpt_service import GPTService
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import clean_single_line
from utils.prompt_loader import load_prompt_template

router = APIRouter(tags=["Eisenhower"])
gpt_service = GPTService(api_key=OPENAI_API_KEY)

@router.post("/order-recommendation", response_model=EisenhowerRecommendationResponse)
@safe_gpt_handler
async def eisenhower_order_recommendation(request: EisenhowerTaskRequest):
    user_prompt = load_prompt_template("prompts/eisenhower/eisenhower_order_prompt.txt", {
        "title": request.title,
        "currentQuadrant": request.currentQuadrant,
        "dueDate": request.dueDate.strftime("%Y-%m-%d") if request.dueDate else None,
        "today": datetime.now().strftime("%Y-%m-%d")
    })

    system_prompt = "당신은 아이젠하워 매트릭스를 기준으로 작업을 사분면에 분류해주는 도우미입니다."

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    lines = gpt_output.split("\n")
    quadrant = clean_single_line(lines[0])
    reason = clean_single_line(" ".join(lines[1:]))

    return EisenhowerRecommendationResponse(
        recommendedQuadrant=quadrant,
        reason=reason,
        isSameAsCurrent=(quadrant == request.currentQuadrant)
    )
