from fastapi import APIRouter, HTTPException
from openai import OpenAI
from config import OPENAI_API_KEY
from models.request import GPTRequest, MindMapRequest
import json  # 🔥 JSON 파싱을 위한 모듈


router = APIRouter()
client = OpenAI(api_key=OPENAI_API_KEY)  # OpenAI API 초기화

# 일정 마인드맵 노드 생성
@router.post("/generate_shcedule")
async def generate_gpt_response(request: GPTRequest):
    try:
        # 🔥 루트 노드부터 현재 선택한 노드까지의 경로를 프롬프트에 반영
        path_text = "\n".join([
            f"Q: {node['title']} A: {node['answer'] if node['answer'] is not None else '없음'}"
            for node in request.nodePath
        ])

        # 🔥 GPT에 전달할 프롬프트 생성
        prompt = f"""
        사용자가 '{request.nodePath[-1]['title']}'에 대한 마인드맵을 작성 중입니다.
        
        현재까지의 마인드맵 흐름:
        {path_text}

        위의 내용을 바탕으로 관련된 추가 질문 6개를 생성해주세요.
        질문은 리스트 형태로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 마인드맵 질문 생성 도우미입니다. 사용자가 할일을 정리할 수 있도록 돕고 일정 정리에 초점을 맞춘 질문을 해주세요."},
                {"role": "user", "content": prompt}
            ]
        )

        # 숫자 및 불필요한 접두어 제거
        generated_text = response.choices[0].message.content
        clean_questions = [q.lstrip("0123456789.- ").strip().strip("'\"") for q in generated_text.split("\n") if q.strip()]

        return {"generated_questions": clean_questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# 생각 정리 마인드맵 노드 생성
@router.post("/generate_thought")
async def generate_thought_node(request: GPTRequest):
    try:
        path_text = "\n".join([
            f"Q: {node['title']} A: {node['answer'] if node['answer'] is not None else '없음'}"
            for node in request.nodePath
        ])

        prompt = f"""
        사용자가 '{request.nodePath[-1]['title']}'에 대한 생각 정리 마인드맵을 작성 중입니다.
        
        현재까지의 마인드맵 흐름:
        {path_text}

        위의 내용을 바탕으로 관련된 추가 질문 6개를 생성해주세요.
        질문은 리스트 형태로 제공하고, **숫자, 기호, 따옴표 없이** 순수한 질문 내용만 포함해주세요.
        """

        response = client.chat.completions.create(
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

# 일정 마인드맵을 TODO 리스트로 변환
@router.post("/convert_schedule_todo")
async def convert_schedule_to_todo(request: MindMapRequest):
    try:
        prompt = f"""
        아래 일정 마인드맵을 기반으로 TODO 리스트를 만들어주세요.
        
        일정 마인드맵:
        {request.mindmapData}

        TODO 리스트는 사용자가 실행할 수 있는 **구체적인 작업 리스트** 형식으로 변환해주세요.
        답변만 요약하는 방식 말고 질문과 연결지어 생각을 정리해주세요.
        바로 리스트를 데이터로 사용할거라서 다른 추가적인 설명은 필요하지 않습니다.
        그리고 **숫자, 기호, 따옴표 없이** 순수한 리스트 형태로 제공해주세요.
        """

        response = client.chat.completions.create(
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

@router.post("/convert_thought_list")
async def convert_thought_to_key_value_list(request: MindMapRequest):
    try:
        prompt = f"""
        우선 처음으로 아래 생각 정리 마인드맵 전체 데이터를 보고 마인드맵 전체 노드 질문 답변 내용을 하나도 빠지지 않게 줄글로 정리한 뒤, 해당 내용을 바탕으로 **Key-Value 리스트** 형태로 변환해주세요.
        이때 내용이 마인드맵의 질문과 답변에 대한 내용을 그대로 가져와서 쓰는게 아니라, 적절하게 요약만 해주셔야 합니다.
        Key-Value 쌍이 적어도 마인드앱 노드 수의 절반 이하가 될 수 있도록 적절하게 요약 해주시고, Key 부분은 주제만 단답으로, Value 부분은 문장으로 마무리 해주세요.


        **📌 마인드맵 데이터:**
        ```
        {request.mindmapData}
        ```
        🔹 **변환 요구사항**
        - **Key-Value 형태의 JSON 리스트(List of Objects)로 변환**
        - **"key"와 "value" 속성을 포함**
        - **프론트에서 직접 JSON 데이터로 사용 가능하도록 순수 JSON만 출력**
        - **마크다운 코드 블록(````json ... `````) 없이 순수 JSON만 반환**
        - **불필요한 설명 없이 JSON 리스트만 출력**
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "당신은 생각정리 마인드맵 전체 데이터를 받아 전체 노드 내용을 보고 맥락을 이해한 뒤, 요약된 내용을 바탕으로 Key-Value 리스트 형태로 변환하는 도우미입니다. 순수 JSON 리스트를 반환하세요."},
                {"role": "user", "content": prompt}
            ]
        )

        # 🔥 응답에서 마크다운 코드 블록 제거 후 JSON 변환
        raw_response = response.choices[0].message.content
        clean_json = raw_response.strip("```json").strip("```").strip()  # 불필요한 마크다운 제거

        # 🔥 JSON 문자열을 리스트로 변환
        key_value_list = json.loads(clean_json)

        return {"thought_key_value_list": key_value_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))