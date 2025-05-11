import os

class Settings:
    OPENNI_PATH: str = os.getenv("OPENNI_PATH", "C:/Orbecc/OpenNI_2.3.0.86_202210111950_4c8f5aa4_beta6_windows/OpenNI_2.3.0.86_202210111950_4c8f5aa4_beta6_windows/samples/bin")

    OUTPUT_DIR: str = os.getenv("OUTPUT_DIR", "capturas")

settings = Settings()
