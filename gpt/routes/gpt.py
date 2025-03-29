from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI
from config import OPENAI_API_KEY
from models.request import GPTRequest, NodeSummaryRequest, ConvertToTaskRequest

router = APIRouter()
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

# 노드 데이터를 안전하게 가져오는 함수 (존재 여부 확인)
def get_node_text(node, field, default="없음"):
    return getattr(node, field, default) if node else default

# 일정 마인드맵 노드 생성 (GPT 추천 질문)
@router.post("/generate_schedule")
async def generate_schedule_node(request: GPTRequest):
    try:
        # mainNode.summary 필수값 검증
        if not request.mainNode or not request.mainNode.summary or not request.mainNode.summary.strip():
            raise HTTPException(status_code=400, detail="mainNode.summary 값이 비어 있거나 잘못되었습니다.")

        # 마인드맵 흐름 정리
        path_text_parts = [f"🟢 전체 주제: **{request.mainNode.summary}**"]

        if request.parentNode:
            path_text_parts.append(f"🔹 **이전 흐름 (부모 노드)**\n- {get_node_text(request.parentNode, 'summary')}")

        if request.selectedNode:
            path_text_parts.append(f"🔹 **현재 선택된 노드**\n- {get_node_text(request.selectedNode, 'summary')}")

        path_text = "\n".join(path_text_parts)

        # GPT에 전달할 프롬프트 생성
        prompt = f"""
        사용자가 '{request.mainNode.summary}'에 대한 일정 마인드맵을 작성 중입니다.

        현재까지의 마인드맵 흐름:
        {path_text}

        이 마인드맵은 사용자가 일정 계획을 수립하는 데 도움을 주는 용도로 사용됩니다.
        위의 내용을 바탕으로 **'{request.mainNode.summary}'와 관련된 일정 계획을 세우는 데 유용한 추가 질문 6개**를 생성해주세요.

        질문은 **리스트 형태**로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        # OpenAI API 호출 (비동기 처리)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 일정 마인드맵 질문 생성 도우미입니다. 사용자가 일정을 정리할 수 있도록 돕고, 일정 계획에 초점을 맞춘 질문을 제공하세요."},
                {"role": "user", "content": prompt}
            ]
        )

        # 응답 처리 (불필요한 숫자 및 기호 제거)
        generated_text = response.choices[0].message.content
        clean_questions = [q.lstrip("0123456789.- ").strip().strip("'\"") for q in generated_text.split("\n") if q.strip()]

        return {"generated_questions": clean_questions}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 생각 정리 마인드맵 노드 생성 (GPT 추천 질문)
@router.post("/generate_thought")
async def generate_thought_node(request: GPTRequest):
    try:
        # mainNode.summary 필수값 검증
        if not request.mainNode or not request.mainNode.summary or not request.mainNode.summary.strip():
            raise HTTPException(status_code=400, detail="mainNode.summary 값이 비어 있거나 잘못되었습니다.")

        # 마인드맵 흐름 정리
        path_text_parts = [f"🟢 전체 주제: **{request.mainNode.summary}**"]

        if request.parentNode:
            path_text_parts.append(f"🔹 **이전 흐름 (부모 노드)**\n- {get_node_text(request.parentNode, 'summary')}")

        if request.selectedNode:
            path_text_parts.append(f"🔹 **현재 선택된 노드**\n- {get_node_text(request.selectedNode, 'summary')}")

        path_text = "\n".join(path_text_parts)

        # GPT에 전달할 프롬프트 생성
        prompt = f"""
        사용자가 '{request.mainNode.summary}'에 대한 생각 정리 마인드맵을 작성 중입니다.

        현재까지의 마인드맵 흐름:
        {path_text}

        위의 내용을 바탕으로 생각을 정리할 수 있도록 관련된 추가 질문 6개를 생성해주세요.
        질문은 **리스트 형태**로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        # OpenAI API 호출 (비동기 처리)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 생각 정리 마인드맵 질문 생성 도우미입니다. 사용자가 깊이 있는 생각을 정리할 수 있도록 돕는 질문을 제공하세요."},
                {"role": "user", "content": prompt}
            ]
        )

        # 응답 처리 (불필요한 숫자 및 기호 제거)
        generated_text = response.choices[0].message.content
        clean_questions = [q.lstrip("0123456789.- ").strip().strip("'\"") for q in generated_text.split("\n") if q.strip()]

        return {"generated_questions": clean_questions}

    except HTTPException as e:
        raise e  # 명시적으로 정의한 400 에러 반환
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/convert_to_task")
async def convert_mindmap_nodes_to_task(request: ConvertToTaskRequest):
    try:
        # Step 1: 노드 요약 텍스트 생성 (간단하게 연결)
        summaries = [node.summary for node in request.selectedNodes if node.summary.strip()]
        if not summaries:
            raise HTTPException(status_code=400, detail="요약할 노드가 없습니다.")

        node_text = "\n".join(f"- {s}" for s in summaries)

        prompt = f"""
        다음은 사용자가 마인드맵에서 선택한 노드들입니다:

        {node_text}

        이 노드들을 기반으로 하나의 할 일(Task)로 만들고자 합니다.
        이 내용을 바탕으로 **간결하고 핵심적인 하나의 작업 제목**을 생성해주세요.
        """

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 여러 마인드맵 노드를 하나의 작업으로 변환하는 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        task_title = response.choices[0].message.content.strip()


        new_task = {
            "title": task_title
        }

        return {"task": new_task}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 노드 요약 API
@router.post("/summarize_node")
async def summarize_node(request: NodeSummaryRequest):
    try:
        # 받은 question과 answer를 사용해 프롬프트 구성
        prompt = f"""
        사용자가 다음과 같은 질문과 답변을 입력했습니다.

        **질문:** {request.question}
        **답변:** {request.answer}

        위의 내용을 한 문장으로 자연스럽게 요약해주세요.
        문장은 **간결하고 핵심적인 내용**만 포함하며, 불필요한 설명을 제거해주세요.
        
        - 요약 문장은 주어(예시로 "사용자"라는 단어) 없는 완성된 문장으로 작성.
        """

        # GPT 호출 (비동기 처리)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 입력된 질문과 답변을 분석하여 한 문장으로 요약하는 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        # 응답에서 요약 문장 추출
        summarized_text = response.choices[0].message.content.strip()

        return {"summary": summarized_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))