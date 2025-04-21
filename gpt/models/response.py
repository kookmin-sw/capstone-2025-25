from pydantic import BaseModel, Field
from typing import List, Literal


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


class EisenhowerRecommendationResponse(BaseModel):
    recommendedQuadrant: Literal["Q1", "Q2", "Q3", "Q4"] = Field(..., description="추천된 아이젠하워 사분면")
    reason: str = Field(..., description="해당 사분면이 추천된 이유")
    isSameAsCurrent: bool = Field(..., description="현재 사분면과 동일한지 여부")
