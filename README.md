# Expense Tracker Project

A full-stack application to track expenses and budgets.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend (Primary API):** Django REST Framework
- **Microservice:** FastAPI (for CSV parsing and auto-categorization)
- **Database:** SQLite

## Setup Instructions

### 1. Django Backend
```bash
cd backend-django
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver 8000
```

### 2. FastAPI Microservice
```bash
cd backend-fastapi
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install fastapi uvicorn pandas python-multipart
uvicorn main:app --reload --port 8001
```

### 3. React Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- Dashboard with charts and summaries
- Full CRUD for transactions and budgets
- CSV import with auto-categorization via Pandas and Regex
- Responsive design with CSS modules
