#!/bin/bash
cd backend

source venv/Scripts/activate
flake8 .
black .
