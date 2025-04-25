from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.response import GeneratedQuestionsResponse
from models.temporary_request import BrainStormingRequest
from models.temporary_response import BrainStormingResponse
from services.gpt_service import GPTService
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import build_mindmap_context_text, clean_question_lines
from utils.prompt_loader import load_prompt_template

router = APIRouter()
gpt_service = GPTService(api_key=OPENAI_API_KEY)


@router.post("/brainstorming/extract/chucks", response_model=BrainStormingResponse)
@safe_gpt_handler
async def extract_chucks(request: BrainStormingRequest):
    user_prompt = load_prompt_template("prompts/extract_chucks_prompt.txt", {
        "text": request.text
    })

    system_prompt = "당신은 ADHD 사용자의 복잡한 생각을 주제 단위로 분리해주는 도우미입니다. 추측 없이 원문을 기준으로 문맥을 나누어주세요."
    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_questions = clean_question_lines(gpt_output)

    print(f"Extracted chunks: {refined_questions}")
    return BrainStormingResponse(extracted_chunks=refined_questions)
