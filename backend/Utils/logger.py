import logging
import sys

class AppLogger:
    @staticmethod
    def get_logger(name: str) -> logging.Logger:
        logger = logging.getLogger(name)
        if not logger.hasHandlers():
            logger.setLevel(logging.DEBUG)
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
            handler.setFormatter(formatter)
            logger.addHandler(handler)
        return logger
