from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.request import MindmapNodeContextRequest, NodeSummaryRequest, ConvertToTaskRequest
from models.response import GeneratedQuestionsResponse, ConvertedTaskResponse, SummarizedNodeResponse
from services.gpt_service import GPTService
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import build_mindmap_context_text, clean_question_lines, build_node_summary_text, \
    clean_single_line
from utils.prompt_loader import load_prompt_template
from fastapi import APIRouter

from config import OPENAI_API_KEY
from models.request import MindmapNodeContextRequest, NodeSummaryRequest, ConvertToTaskRequest
from models.response import GeneratedQuestionsResponse, ConvertedTaskResponse, SummarizedNodeResponse
from services.gpt_service import GPTService
from utils.exception_handler import safe_gpt_handler
from utils.gpt_helper import build_mindmap_context_text, clean_question_lines, build_node_summary_text, \
    clean_single_line
from utils.prompt_loader import load_prompt_template

router = APIRouter(tags=["Mindmap(비활성화)"])
gpt_service = GPTService(api_key=OPENAI_API_KEY)


@router.post("/generate/todo-questions", response_model=GeneratedQuestionsResponse)
@safe_gpt_handler
async def generate_todo_questions(request: MindmapNodeContextRequest):
    path_text = build_mindmap_context_text(request)

    user_prompt = load_prompt_template("prompts/todo_prompt.txt", {
        "summary": request.mainNode.summary,
        "path_text": path_text
    })

    system_prompt = "당신은 일정 마인드맵 질문 생성 도우미입니다. 사용자가 일정을 정리할 수 있도록 돕고, 일정 계획에 초점을 맞춘 질문을 제공하세요."
    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_questions = clean_question_lines(gpt_output)

    return GeneratedQuestionsResponse(generated_questions=refined_questions)


@router.post("/generate/thinking-questions", response_model=GeneratedQuestionsResponse)
@safe_gpt_handler
async def generate_thinking_questions(request: MindmapNodeContextRequest):
    path_text = build_mindmap_context_text(request)

    user_prompt = load_prompt_template("prompts/thinking_prompt.txt", {
        "summary": request.mainNode.summary,
        "path_text": path_text
    })

    system_prompt = "당신은 생각 정리 마인드맵 질문 생성 도우미입니다. 사용자가 깊이 있는 생각을 정리할 수 있도록 돕는 질문을 제공하세요."
    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_questions = clean_question_lines(gpt_output)

    return GeneratedQuestionsResponse(generated_questions=refined_questions)


@router.post("/convert-to-task", response_model=ConvertedTaskResponse)
@safe_gpt_handler
async def convert_to_task(request: ConvertToTaskRequest):
    node_text = build_node_summary_text(request)

    user_prompt = load_prompt_template("prompts/convert_task_prompt.txt", {
        "node_text": node_text
    })

    gpt_prompt = "당신은 여러 마인드맵 노드를 하나의 작업으로 변환하는 도우미입니다. 사용자가 제공한 노드들을 바탕으로 작업 제목을 생성하세요."

    gpt_output = await gpt_service.ask(gpt_prompt, user_prompt)

    refined_text = clean_single_line(gpt_output)

    return ConvertedTaskResponse(title=refined_text)


@router.post("/summarize-node", response_model=SummarizedNodeResponse)
@safe_gpt_handler
async def summarize_node(request: NodeSummaryRequest):
    user_prompt = load_prompt_template("prompts/summarize_prompt.txt", {
        "question": request.question,
        "answer": request.answer
    })

    system_prompt = "당신은 입력된 질문과 답변을 분석하여 한 문장으로 요약하는 도우미입니다."

    gpt_output = await gpt_service.ask(system_prompt, user_prompt)

    refined_text = clean_single_line(gpt_output)

    return SummarizedNodeResponse(summary=refined_text)
