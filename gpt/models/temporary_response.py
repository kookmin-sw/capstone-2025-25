from pydantic import BaseModel, Field


class BrainStormingResponse(BaseModel):
    extracted_chunks: list[str] = Field(
        ..., description="입력된 텍스트를 청크단위로 추출한 결과"
    )
