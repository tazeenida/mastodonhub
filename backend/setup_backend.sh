#!/bin/bash

echo "Removing old virtual environment..."
rm -rf venv

echo "Creating a new virtual environment..."
python3.11 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# echo "Creating superuser (if needed)..."
# python manage.py createsuperuser --noinput || echo "Superuser already exists."

echo "Starting Django server..."
python manage.py runserver

# Code to run backend:
#   chmod +x setup_backend.sh
#   ./setup_backend.sh
