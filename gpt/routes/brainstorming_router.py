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
    user_prompt = load_prompt_template("prompts/brainstorming/extract_chucks_prompt.txt", {
        "text": request.text
    })

    # system_prompt = "당신은 ADHD 사용자의 복잡한 생각을 주제 단위로 분리해주는 도우미입니다. 추측 없이 원문을 기준으로 문맥을 나누어주세요."
    system_prompt = "You are an assistant helping ADHD users organize their thoughts by breaking them into topic-based chunks. Do not make assumptions. Only use the original input."
    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_questions = clean_question_lines(gpt_output)

    return BrainStormingResponse(extracted_chunks=refined_questions)


@router.post("/analyze/chunk", response_model=ChunkAnalysisResponse)
@safe_gpt_handler
async def analyze_chunk(request: BrainStormingChunkRequest):
    user_prompt = load_prompt_template("prompts/brainstorming/chunk_analysis_prompt.txt", {
        "chunk": request.chunk
    })

    system_prompt = "You are a thought organization coach. Your role is to help users clarify and structure their ideas by identifying vague points and asking helpful questions."

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
