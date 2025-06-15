import json
import os


class CommonUtils:
    @classmethod
    def get_config(cls):
        base_path = os.path.dirname(os.path.abspath(__file__))  # Path to Utils/
        config_path = os.path.join(base_path, "..", "Config", "config.json")

        with open(config_path) as f:
            config = json.load(f)
        return config
