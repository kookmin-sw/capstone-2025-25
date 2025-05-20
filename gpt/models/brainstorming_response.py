from typing import List

from pydantic import BaseModel, Field


class BrainStormingResponse(BaseModel):
    extracted_chunks: list[str] = Field(
        ..., description="입력된 텍스트를 청크단위로 추출한 결과"
    )


class ChunkAnalysisResponse(BaseModel):
    clarifying_questions: List[str] = Field(
        ..., description="청크에 대한 명확한 질문 목록"
    )


class MindmapToChunkResponse(BaseModel):
    new_chunk: str = Field(
        ..., description="마인드맵 데이터를 청크로 변환한 결과"
    )

class MergeChunksResponse(BaseModel):
    merged_chunk: str
