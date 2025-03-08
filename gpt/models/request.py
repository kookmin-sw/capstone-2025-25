from pydantic import BaseModel
from typing import List, Dict, Optional, Any


class GPTRequest(BaseModel):
    nodePath: List[Dict[str, Optional[str]]]  # 루트부터 선택 노드까지의 데이터 (제목, 답변 포함)

class Node(BaseModel):
    question: str
    answer: Optional[str] = None
    children: List["Node"] = []

class MindMapRequest(BaseModel):
    mindmapData: Dict[str, Any]  # 전체 마인드맵 데이터를 JSON 형태로 받음
