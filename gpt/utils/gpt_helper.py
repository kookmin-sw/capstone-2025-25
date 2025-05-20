import re

from fastapi import HTTPException

from models.mindmap_request import MindmapNodeContextRequest, ConvertToTaskRequest


def build_mindmap_context_text(request: MindmapNodeContextRequest) -> str:
    """마인드맵 흐름 정리 텍스트 생성"""
    parts = [f"전체 주제: **{request.mainNode.summary}**"]
    if request.parentNode:
        parts.append(f"**이전 흐름 (부모 노드)**\n- {request.parentNode.summary}")
    if request.selectedNode:
        parts.append(f"**현재 선택된 노드**\n- {request.selectedNode.summary}")
    return "\n".join(parts)

def clean_question_lines(text: str) -> list[str]:
    """
    GPT 응답에서 리스트 형태의 질문들을 정제
    - 숫자/기호 접두어 제거
    - 따옴표, 이스케이프 문자 제거
    - 의미 없는 항목 ("[]", "-") 제거
    - 공백 정리
    """
    cleaned_lines = []

    for line in text.split("\n"):
        line = line.strip()
        if not line or line in {"[]", "-"}:
            continue  # 빈 줄, 무의미 항목 제외

        # 접두어 숫자/기호 제거
        line = line.lstrip("0123456789.- ")

        # 이스케이프 문자 제거
        line = line.replace('\\"', '"').replace("\\'", "'").replace("\\n", " ")

        # 양끝 따옴표 제거
        line = line.strip('"').strip("'")

        # 공백 정리
        line = re.sub(r"\s+", " ", line)

        if line and line not in {"[]", "-"}:
            cleaned_lines.append(line)

    return cleaned_lines

def clean_single_line(text: str) -> str:
    """
    GPT 응답이 한 줄일 때의 정제
    - 따옴표, 이스케이프 문자 제거
    - 공백 정리
    """
    text = text.strip()
    text = text.replace("\\", "")
    text = text.strip('"').strip("'")
    text = re.sub(r"\s+", " ", text)

    return text

def build_node_summary_text(request: ConvertToTaskRequest) -> str:
    summaries = [node.summary for node in request.selectedNodes if node.summary.strip()]
    if not summaries:
        raise HTTPException(status_code=400, detail="요약할 노드가 없습니다.")
    return "\n".join(f"- {s}" for s in summaries)
