from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Day 21: Analytics endpoint (spending summary)
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

    # Day 21: Analytics endpoint (category breakdown)
    @action(detail=False, methods=['get'])
    def category_breakdown(self, request):
        expenses = self.get_queryset().filter(type='expense')
        breakdown = expenses.values('category__name').annotate(total=Sum('amount')).order_by('-total')
        return Response(breakdown)

# Day 20: Budget endpoints (monthly limit CRUD & progress)
class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def progress(self, request):
        budgets = self.get_queryset()
        progress_data = []
        for budget in budgets:
            spent = Transaction.objects.filter(
                category=budget.category,
                type='expense',
                user=request.user
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
