from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI
from config import OPENAI_API_KEY
from models.request import GPTRequest, MindMapRequest, NodeSummaryRequest
import json

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
        raise e  # 명시적으로 정의한 400 에러 반환
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

# 마인드맵 데이터를 GPT 요청용 문자열로 변환하는 함수

# 노드 리스트를 부모-자식 관계로 변환하는 함수
def build_mindmap_tree(nodes):
    """ 노드 리스트를 트리 구조로 변환 """
    node_dict = {node.id: {"summary": node.summary, "children": []} for node in nodes}

    root_node = None

    for node in nodes:
        if node.parentId is None:
            root_node = node_dict[node.id]  # 루트 노드 찾기
        else:
            node_dict[node.parentId]["children"].append(node_dict[node.id])  # 부모-자식 연결

    return root_node


# 트리 구조를 GPT 입력용 계층형 텍스트로 변환
def format_tree_for_gpt(node, depth=0):
    indent = "  " * depth  # 들여쓰기 설정
    text = f"{indent}- {node['summary']}\n"

    for child in node["children"]:
        text += format_tree_for_gpt(child, depth + 1)

    return text


# 일정 마인드맵을 TODO 리스트로 변환
@router.post("/convert_schedule_todo")
async def convert_schedule_to_todo(request: MindMapRequest):
    try:
        # 마인드맵 트리 구조 생성
        mindmap_tree = build_mindmap_tree(request.nodes)

        # GPT에 전달할 계층형 텍스트 생성
        mindmap_text = format_tree_for_gpt(mindmap_tree)

        prompt = f"""
        사용자가 아래 일정 마인드맵을 기반으로 일정 계획을 정리하고 있습니다.
        
        ** 마인드맵 개요**
        {mindmap_text}

        위의 정보를 바탕으로 **실행 가능한 TODO 리스트**를 생성해주세요.
        - 마인드맵의 부모-자식 관계를 고려하여 논리적으로 구성.
        - 실천 가능한 액션 아이템 형태로 변환.
        - 숫자, 기호 없이 순수한 리스트 형태로 반환.
        - 마인드맵의 데이터를 바탕으로 다른 정보를 추가하지 않고, 주어진 정보만으로 변환.
        - 바로 데이터로 사용할거니까 제목은 필요없고 내용 리스트만 반환.
        - "-"와 같은 특수문자, 기호 없이 순수한 내용만 반환.
        """


        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 일정 계획을 정리하는 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_text = response.choices[0].message.content
        todo_list = [item.strip().strip("'\"") for item in generated_text.split("\n") if item.strip()]

        return {"todo_list": todo_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 생각 정리 마인드맵을 Key-Value 리스트로 변환
@router.post("/convert_thought_list")
async def convert_thought_to_key_value_list(request: MindMapRequest):
    try:
        # 마인드맵 트리 구조 생성
        mindmap_tree = build_mindmap_tree(request.nodes)

        # GPT에 전달할 계층형 텍스트 생성
        mindmap_text = format_tree_for_gpt(mindmap_tree)

        prompt = f"""
        사용자가 아래 생각 정리 마인드맵을 작성하고 있습니다. 
        
        **마인드맵 개요**
        {mindmap_text}

        위의 정보를 바탕으로 **핵심 내용을 Key-Value 리스트로 변환**해주세요.
        - Key는 주제 (summary), Value는 해당 내용에 대한 짧은 설명.
        - Key-Value 형태의 JSON 리스트로 변환.
        - JSON 코드 블록 없이 순수 JSON만 반환.
        - 마인드맵의 데이터를 바탕으로 다른 정보를 추가하지 않고, 주어진 정보만으로 변환.
        - 바로 데이터로 사용할거니까 제목은 필요없고 내용만 반환.
        """

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 생각 정리를 돕는 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        raw_response = response.choices[0].message.content
        clean_json = raw_response.strip("```json").strip("```").strip()  # 불필요한 마크다운 제거

        key_value_list = json.loads(clean_json)  # JSON 변환

        return {"thought_list": key_value_list}

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