import logging

def setup_logging():
    """ FastAPI용 로깅 설정 """
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    return logging.getLogger(__name__)