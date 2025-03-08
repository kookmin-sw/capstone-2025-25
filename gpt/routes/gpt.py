from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI
from config import OPENAI_API_KEY
from models.request import GPTRequest, MindMapRequest
import json  # 🔥 JSON 파싱 모듈

router = APIRouter()
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

# ✅ 일정 마인드맵 노드 생성 (GPT 추천 질문)
@router.post("/generate_schedule")
async def generate_gpt_response(request: GPTRequest):
    try:
        path_text = "\n".join([
            f"Q: {node.title} A: {node.answer if node.answer is not None else '없음'}"
            for node in request.nodePath
        ])

        prompt = f"""
        사용자가 '{request.nodePath[-1].title}'에 대한 마인드맵을 작성 중입니다.
        
        현재까지의 마인드맵 흐름:
        {path_text}

        위의 내용을 바탕으로 관련된 추가 질문 6개를 생성해주세요.
        질문은 리스트 형태로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 마인드맵 질문 생성 도우미입니다. 사용자가 할일을 정리할 수 있도록 돕고 일정 정리에 초점을 맞춘 질문을 해주세요."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_text = response.choices[0].message.content
        clean_questions = [q.lstrip("0123456789.- ").strip().strip("'\"") for q in generated_text.split("\n") if q.strip()]

        return {"generated_questions": clean_questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 생각 정리 마인드맵 노드 생성 (GPT 추천 질문)
@router.post("/generate_thought")
async def generate_thought_node(request: GPTRequest):
    try:
        path_text = "\n".join([
            f"Q: {node.title} A: {node.answer if node.answer is not None else '없음'}"
            for node in request.nodePath
        ])

        prompt = f"""
        사용자가 '{request.nodePath[-1].title}'에 대한 생각 정리 마인드맵을 작성 중입니다.
        
        현재까지의 마인드맵 흐름:
        {path_text}
        위의 내용을 바탕으로 관련된 추가 질문 6개를 생성해주세요.
        질문은 리스트 형태로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 생각 정리 마인드맵 질문 생성 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_text = response.choices[0].message.content
        clean_questions = [q.lstrip("0123456789.- ").strip().strip("'\"") for q in generated_text.split("\n") if q.strip()]

        return {"generated_questions": clean_questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 일정 마인드맵을 TODO 리스트로 변환
@router.post("/convert_schedule_todo")
async def convert_schedule_to_todo(request: MindMapRequest):
    try:
        prompt = f"""
        아래 일정 마인드맵을 기반으로 TODO 리스트를 만들어주세요.
        
        일정 마인드맵:
        {request.mindmapData}

        TODO 리스트는 사용자가 실행할 수 있는 **구체적인 작업 리스트** 형식으로 변환해주세요.
        """

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 일정 관리를 돕는 도우미입니다."},
                {"role": "user", "content": prompt}
            ]
        )

        generated_text = response.choices[0].message.content
        todo_list = [item.strip().strip("'\"") for item in generated_text.split("\n") if item.strip()]

        return {"todo_list": todo_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ 생각 정리 마인드맵을 Key-Value 리스트로 변환
@router.post("/convert_thought_list")
async def convert_thought_to_key_value_list(request: MindMapRequest):
    try:
        prompt = f"""
        아래 생각 정리 마인드맵 데이터를 Key-Value 리스트 형식으로 변환해주세요.

        **📌 마인드맵 데이터:**
        ```
        {request.mindmapData}
        ```

        🔹 **변환 요구사항**
        - **Key-Value 형태의 JSON 리스트(List of Objects)로 변환**
        - **"key"와 "value" 속성을 포함**
        - **프론트에서 직접 JSON 데이터로 사용 가능하도록 순수 JSON만 출력**
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

        return {"thought_key_value_list": key_value_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))