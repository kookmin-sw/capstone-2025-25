from pydantic import BaseModel, Field, model_validator


class BrainStormingRequest(BaseModel):
    text: str = Field(..., description="브레인스토밍 유저 입력 텍스트")

    @model_validator(mode="after")
    def check_text_not_blank(self):
        if not self.text.strip():
            raise ValueError("text는 공백일 수 없습니다.")
        return self
