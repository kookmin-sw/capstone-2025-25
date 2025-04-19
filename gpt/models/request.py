from typing import Optional, List
from pydantic import BaseModel

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
