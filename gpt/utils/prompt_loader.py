import os
from jinja2 import Template

def load_prompt_template(relative_path: str, context: dict) -> str:
    base_dir = os.path.dirname(__file__)  # utils 폴더 경로
    prompt_path = os.path.join(base_dir, "..", relative_path)  # app 기준 상대경로
    prompt_path = os.path.abspath(prompt_path)  # 절대경로로 변환

    with open(prompt_path, "r", encoding="utf-8") as f:
        template_str = f.read()

    template = Template(template_str)
    return template.render(**context)
