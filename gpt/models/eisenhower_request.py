from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


class EisenhowerTaskRequest(BaseModel):
    title: str = Field(..., description="작업 제목")
    currentQuadrant: Literal["Q1", "Q2", "Q3", "Q4"] = Field(..., description="사용자가 선택한 현재 사분면")
    dueDate: Optional[date] = Field(None, description="마감일 (선택 사항)")
