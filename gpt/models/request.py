from typing import Optional, List
from pydantic import BaseModel

class NodeSummaryData(BaseModel):
    summary: Optional[str] = None
class GPTRequest(BaseModel):
    mainNode: NodeSummaryData
    parentNode: Optional[NodeSummaryData] = None
    selectedNode: Optional[NodeSummaryData] = None

class NodeData(BaseModel):
    id: Optional[str] = None
    type: Optional[str] = None
    parentId: Optional[str] = None
    summary: Optional[str] = None

class MindMapRequest(BaseModel):
    nodes: List[NodeData]

class NodeSummaryRequest(BaseModel):
    question: str
    answer: str
