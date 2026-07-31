from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date')
    serializer_class = TransactionSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        queryset = self.get_queryset()
        total_income = queryset.filter(type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = queryset.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        balance = total_income - total_expense
        return Response({
            'total_income': total_income,
            'total_expense': total_expense,
            'balance': balance
        })

    @action(detail=False, methods=['get'])
    def category_breakdown(self, request):
        expenses = self.get_queryset().filter(type='expense')
        breakdown = expenses.values('category__name').annotate(total=Sum('amount')).order_by('-total')
        return Response(breakdown)

class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer

    @action(detail=False, methods=['get'])
    def progress(self, request):
        budgets = self.get_queryset()
        progress_data = []
        for budget in budgets:
            spent = Transaction.objects.filter(
                category=budget.category,
                type='expense'
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            progress_data.append({
                'id': budget.id,
                'category_name': budget.category.name,
                'limit': budget.limit,
                'spent': spent,
                'remaining': budget.limit - spent,
                'percentage': (spent / budget.limit) * 100 if budget.limit > 0 else 0
            })
        return Response(progress_data)
