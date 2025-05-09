from typing import List

from pydantic import BaseModel, Field


class GeneratedQuestionsResponse(BaseModel):
    generated_questions: List[str] = Field(
        ..., description="GPT가 생성한 질문 리스트"
    )


class ConvertedTaskResponse(BaseModel):
    title: str = Field(
        ..., description="선택된 노드들을 바탕으로 생성된 작업 제목"
    )


class SummarizedNodeResponse(BaseModel):
    summary: str = Field(
        ..., description="질문과 답변을 요약한 결과"
    )
