from pydantic import BaseModel, Field
from typing import List, Literal


class GeneratedQuestionsResponse(BaseModel):
    generated_questions: List[str]


class ConvertedTaskResponse(BaseModel):
    title: str


class SummarizedNodeResponse(BaseModel):
    summary: str


class EisenhowerRecommendationResponse(BaseModel):
    recommendedQuadrant: Literal["Q1", "Q2", "Q3", "Q4"] = Field(..., description="추천된 아이젠하워 사분면")
    reason: str = Field(..., description="해당 사분면이 추천된 이유")
    isSameAsCurrent: bool = Field(..., description="현재 사분면과 동일한지 여부")
