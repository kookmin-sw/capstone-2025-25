from pydantic import BaseModel
from typing import List

class GeneratedQuestionsResponse(BaseModel):
    generated_questions: List[str]

class ConvertedTaskResponse(BaseModel):
    title: str

class SummarizedNodeResponse(BaseModel):
    summary: str
