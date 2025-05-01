from typing import Tuple, List

from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.temporary_request import BrainStormingRequest, BrainStormingChunkRequest, RewriteChunkRequest
from models.temporary_response import BrainStormingResponse, ChunkAnalysisResponse, MindmapToChunkResponse
from services.gpt_service import GPTService
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import clean_question_lines
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

    return BrainStormingResponse(extracted_chunks=refined_questions)


def parse_chunk_analysis(gpt_output: str) -> Tuple[List[str], List[str]]:
    sections = gpt_output.strip().split("[구체화 질문]")
    ambiguous_section = sections[0].replace("[모호한 점]", "").strip()
    questions_section = sections[1].strip() if len(sections) > 1 else ""

    ambiguous_points = [line.strip("- ").strip() for line in ambiguous_section.split("\n") if line.strip()]
    questions = [line.strip("- ").strip() for line in questions_section.split("\n") if line.strip()]

    return ambiguous_points, questions


@router.post("/brainstorming/analyze/chunk", response_model=ChunkAnalysisResponse)
@safe_gpt_handler
async def analyze_chunk(request: BrainStormingChunkRequest):
    user_prompt = load_prompt_template("prompts/chunk_analysis_prompt.txt", {
        "chunk": request.chunk
    })

    system_prompt = "당신은 생각 정리 코치입니다. 사용자가 주제를 더 명확히 정의하고 구조화할 수 있도록 도와주는 역할입니다."

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    # 파싱 유틸 함수로 분리
    ambiguous_points, questions = parse_chunk_analysis(gpt_output)

    return ChunkAnalysisResponse(
        ambiguous_points=ambiguous_points,
        clarifying_questions=questions
    )

@router.post("/brainstorming/rewrite/chunk", response_model=MindmapToChunkResponse)
@safe_gpt_handler
async def rewrite_chunk(request: RewriteChunkRequest):
    user_prompt = load_prompt_template("prompts/mindmap_to_chunk_prompt.txt", {
        "existing_chunk": request.existing_chunk,
        "mindmap_data": [node.context for node in request.mindmap_data]
    })

    system_prompt = "당신은 생각 정리 코치입니다. 사용자가 작성한 청크를 마인드맵 데이터를 참고해 더 명확하고 구체적으로 다듬는 역할입니다."

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    return MindmapToChunkResponse(
        new_chunk=gpt_output.strip()
    )