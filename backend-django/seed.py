from finance.models import Category, Transaction, Budget
from django.contrib.auth.models import User
from datetime import date, timedelta
import random

# Clear existing data for fresh seeding
Transaction.objects.all().delete()
Budget.objects.all().delete()
Category.objects.all().delete()

# Create or get user
user, created = User.objects.get_or_create(username='demo_user', email='demo@example.com')
if created:
    user.set_password('password123')
    user.save()

# Create Categories
categories_data = [
    {"name": "Food & Dining", "color": "#FF6384"},
    {"name": "Transportation", "color": "#36A2EB"},
    {"name": "Entertainment", "color": "#FFCE56"},
    {"name": "Shopping", "color": "#4BC0C0"},
    {"name": "Utilities", "color": "#9966FF"},
    {"name": "Salary", "color": "#4CAF50"},
]

category_objs = {}
for cat in categories_data:
    obj = Category.objects.create(name=cat["name"], color=cat["color"], user=user)
    category_objs[cat["name"]] = obj

# Create Budgets
Budget.objects.create(category=category_objs["Food & Dining"], limit=15000, month=7, year=2026, user=user)
Budget.objects.create(category=category_objs["Transportation"], limit=5000, month=7, year=2026, user=user)
Budget.objects.create(category=category_objs["Entertainment"], limit=8000, month=7, year=2026, user=user)
Budget.objects.create(category=category_objs["Shopping"], limit=12000, month=7, year=2026, user=user)

# Create Transactions (Real Data Simulation)
today = date.today()

transactions = [
    {"amount": 150000, "category": category_objs["Salary"], "type": "income", "desc": "July Salary", "merchant": "Tech Corp", "days_ago": 5},
    {"amount": 2500, "category": category_objs["Food & Dining"], "type": "expense", "desc": "Dinner at Monal", "merchant": "Monal Restaurant", "days_ago": 1},
    {"amount": 4000, "category": category_objs["Transportation"], "type": "expense", "desc": "Fuel", "merchant": "Shell Station", "days_ago": 2},
    {"amount": 1200, "category": category_objs["Entertainment"], "type": "expense", "desc": "Netflix Subscription", "merchant": "Netflix", "days_ago": 3},
    {"amount": 5500, "category": category_objs["Shopping"], "type": "expense", "desc": "Groceries", "merchant": "Imtiaz Supermarket", "days_ago": 4},
    {"amount": 1500, "category": category_objs["Food & Dining"], "type": "expense", "desc": "Lunch at Cafe", "merchant": "Cafe", "days_ago": 4},
    {"amount": 8000, "category": category_objs["Utilities"], "type": "expense", "desc": "Electricity Bill", "merchant": "LESCO", "days_ago": 6},
    {"amount": 3000, "category": category_objs["Shopping"], "type": "expense", "desc": "New Shoes", "merchant": "Bata", "days_ago": 7},
    {"amount": 800, "category": category_objs["Transportation"], "type": "expense", "desc": "Careem Ride", "merchant": "Careem", "days_ago": 7},
]

for t in transactions:
    Transaction.objects.create(
        amount=t["amount"],
        category=t["category"],
        date=today - timedelta(days=t["days_ago"]),
        description=t["desc"],
        type=t["type"],
        merchant=t["merchant"],
        user=user
    )

print("Successfully seeded the database with Categories, Budgets, and Transactions in Rs!")
