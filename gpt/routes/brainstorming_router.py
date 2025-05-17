from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.brainstorming_request import BrainStormingRequest, BrainStormingChunkRequest, RewriteChunkRequest
from models.brainstorming_response import BrainStormingResponse, ChunkAnalysisResponse, MindmapToChunkResponse
from services.gpt_service import GPTService
from utils.brainstorming import parse_chunk_analysis
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import clean_question_lines
from utils.prompt_loader import load_prompt_template

router = APIRouter(tags=["Brainstorming"])
gpt_service = GPTService(api_key=OPENAI_API_KEY)


@router.post("/extract/chunks", response_model=BrainStormingResponse)
@safe_gpt_handler
async def extract_chucks(request: BrainStormingRequest):
    user_prompt = load_prompt_template("prompts/brainstorming/extract_chunks_prompt.txt", {
        "text": request.text
    })

    system_prompt = (
        "당신은 현대인의 복잡하고 산만한 생각을 정리해주는 조력자입니다. "
        "사용자가 입력한 텍스트에는 다양한 생각, 감정, 해야 할 일, 고민 등이 뒤섞여 있습니다. "
        "이 텍스트를 의미 단위로 분리하여 항목별로 정리해 주세요. "
        "새로운 내용을 만들지 말고, 사용자의 표현과 맥락을 그대로 반영해 주세요. "
        "각 항목은 간결하게 작성해 주세요."
    )
    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_questions = clean_question_lines(gpt_output)

    return BrainStormingResponse(extracted_chunks=refined_questions)


@router.post("/analyze/chunk", response_model=ChunkAnalysisResponse)
@safe_gpt_handler
async def analyze_chunk(request: BrainStormingChunkRequest):
    user_prompt = load_prompt_template("prompts/brainstorming/chunk_analysis_prompt.txt", {
        "chunk": request.chunk
    })

    system_prompt = (
        "당신은 사용자의 생각을 명확하게 정리할 수 있도록 도와주는 사고 정리 코치입니다."
        "당신의 역할은 사용자가 표현한 생각이나 할 일을 더 잘 이해하고 구체화할 수 있도록,"
        "모호한 지점을 찾아주고 도움이 되는 질문을 던지는 것입니다."
    )

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    # 파싱 유틸 함수로 분리
    questions = parse_chunk_analysis(gpt_output)

    return ChunkAnalysisResponse(
        clarifying_questions=questions
    )


@router.post("/rewrite/chunk", response_model=MindmapToChunkResponse)
@safe_gpt_handler
async def rewrite_chunk(request: RewriteChunkRequest):
    user_prompt = load_prompt_template("prompts/brainstorming/mindmap_to_chunk_prompt.txt", {
        "existing_chunk": request.existing_chunk,
        "mindmap_data": [node.context for node in request.mindmap_data]
    })

    system_prompt = "You are a thought refinement coach. You help users make their written thoughts more specific and structured by referencing related mindmap data."

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    return MindmapToChunkResponse(
        new_chunk=gpt_output.strip()
    )
