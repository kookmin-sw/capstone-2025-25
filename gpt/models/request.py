from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field


class NodeSummaryData(BaseModel):
    summary: Optional[str] = None
class MindmapNodeContextRequest(BaseModel):
    mainNode: NodeSummaryData
    parentNode: Optional[NodeSummaryData] = None
    selectedNode: Optional[NodeSummaryData] = None

class NodeSummaryRequest(BaseModel):
    question: str
    answer: str

class ConvertToTaskRequest(BaseModel):
    selectedNodes: List[NodeSummaryData]
class EisenhowerTaskRequest(BaseModel):
    title: str = Field(..., description="작업 제목")
    currentQuadrant: Literal["Q1", "Q2", "Q3", "Q4"] = Field(..., description="사용자가 선택한 현재 사분면")
    dueDate: Optional[datetime] = Field(None, description="마감일 (선택 사항)")
