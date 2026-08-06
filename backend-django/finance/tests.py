from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Transaction, Budget

class FinanceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name="Food", color="#ff0000")
        self.transaction = Transaction.objects.create(
            amount=10.50,
            category=self.category,
            date="2026-08-01",
            description="Lunch",
            type="expense"
        )
        self.budget = Budget.objects.create(
            category=self.category,
            limit=100.00,
            month=8,
            year=2026
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Food")
        self.assertEqual(self.category.color, "#ff0000")

    def test_transaction_creation(self):
        self.assertEqual(self.transaction.amount, 10.50)
        self.assertEqual(self.transaction.type, "expense")

    def test_transaction_api_list(self):
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_transaction_api_create(self):
        data = {
            "amount": 25.00,
            "category": self.category.id,
            "date": "2026-08-02",
            "description": "Dinner",
            "type": "expense"
        }
        response = self.client.post('/api/transactions/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 2)

    def test_transaction_api_create_invalid_amount(self):
        data = {
            "amount": -5.00,
            "category": self.category.id,
            "date": "2026-08-02",
            "description": "Negative Amount",
            "type": "expense"
        }
        response = self.client.post('/api/transactions/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_budget_progress_api(self):
        response = self.client.get('/api/budgets/progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['spent'], 10.50)
