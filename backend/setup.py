"""
Setup script for Heart Disease Prediction Backend
"""
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = fh.read().splitlines()

setup(
    name="heart-disease-prediction-backend",
    version="1.0.0",
    author="PDS Team",
    author_email="team@pds-project.edu",
    description="Backend API for Heart Disease Prediction System",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/pds-project/heart-disease-prediction",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Healthcare Industry",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    entry_points={
        "console_scripts": [
            "heart-api=api.app:main",
        ],
    },
)