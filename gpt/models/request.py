from datetime import date
from typing import Optional, List, Literal

from pydantic import BaseModel, Field, model_validator


class NodeSummaryData(BaseModel):
    summary: str = Field(..., description="노드의 요약 또는 주제 내용입니다. (공백은 허용되지 않습니다.)")

    @model_validator(mode="after")
    def check_summary_not_blank(self):
        if not self.summary.strip():
            raise ValueError("summary는 공백일 수 없습니다.")
        return self


class MindmapNodeContextRequest(BaseModel):
    mainNode: NodeSummaryData = Field(..., description="필수: 메인노드의 주제는 필수값입니다.")
    parentNode: Optional[NodeSummaryData] = Field(None, description="선택: 선택된 노드의 부모 노드")
    selectedNode: Optional[NodeSummaryData] = Field(None, description="선택: 현재 선택된 노드")


class NodeSummaryRequest(BaseModel):
    question: str = Field(..., description="사용자가 입력한 질문 내용")
    answer: str = Field(..., description="질문에 대한 답변 내용")

    @model_validator(mode="after")
    def validate_question_and_answer(self):
        if not self.question.strip():
            raise ValueError("question은 빈 값이거나 공백일 수 없습니다.")
        if not self.answer.strip():
            raise ValueError("answer는 빈 값이거나 공백일 수 없습니다.")
        return self


class ConvertToTaskRequest(BaseModel):
    selectedNodes: List[NodeSummaryData] = Field(
        ..., description="작업으로 변환할 선택된 노드 목록 (최소 1개 이상)"
    )

    @model_validator(mode="after")
    def validate_selected_nodes(self):
        if not self.selectedNodes:
            raise ValueError("selectedNodes는 최소 1개 이상의 항목을 포함해야 합니다.")
        return self


class EisenhowerTaskRequest(BaseModel):
    title: str = Field(..., description="작업 제목")
    currentQuadrant: Literal["Q1", "Q2", "Q3", "Q4"] = Field(..., description="사용자가 선택한 현재 사분면")
    dueDate: Optional[date] = Field(None, description="마감일 (선택 사항)")
