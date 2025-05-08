from typing import List


def parse_chunk_analysis(gpt_output: str) -> List[str]:
    sections = gpt_output.strip().split("[Clarifying Questions]")
    questions_section = sections[1].strip() if len(sections) > 1 else ""

    questions = [line.strip("- ").strip() for line in questions_section.split("\n") if line.strip()]

    return questions
