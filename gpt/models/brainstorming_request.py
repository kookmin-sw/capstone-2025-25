from typing import List

from pydantic import BaseModel, Field, model_validator


class BrainStormingRequest(BaseModel):
    text: str = Field(..., description="브레인스토밍 유저 입력 텍스트")

    @model_validator(mode="after")
    def check_text_not_blank(self):
        if not self.text.strip():
            raise ValueError("text는 공백일 수 없습니다.")
        return self


class BrainStormingChunkRequest(BaseModel):
    chunk: str = Field(..., description="브레인스토밍 청크 텍스트 입력")

    @model_validator(mode="after")
    def check_chunk_not_blank(self):
        if not self.chunk.strip():
            raise ValueError("chunk는 공백일 수 없습니다.")
        return self


class MindmapNodeRequest(BaseModel):
    context: str = Field(..., description="노드의 주제 또는 요약")

    @model_validator(mode="after")
    def check_context_not_blank(self):
        if not self.context.strip():
            raise ValueError("context는 공백일 수 없습니다.")
        return self


class RewriteChunkRequest(BaseModel):
    existing_chunk: str = Field(..., description="기존 청크 텍스트")
    mindmap_data: List[MindmapNodeRequest] = Field(

        ..., description="마인드맵 데이터")

    @model_validator(mode="after")
    def check_existing_chunk_not_blank(self):
        if not self.existing_chunk.strip():
            raise ValueError("existing_chunk는 공백일 수 없습니다.")
        return self

class MergeChunksRequest(BaseModel):
    chunks: List[str] = Field(..., description="합칠 텍스트 청크 목록")
