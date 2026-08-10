from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.contrib.auth.models import User
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer, RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

from rest_framework.views import APIView

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_transactions = Transaction.objects.count()
        total_volume = Transaction.objects.filter(type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        
        users_data = []
        for u in User.objects.all():
            tx_count = Transaction.objects.filter(user=u).count()
            users_data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'is_staff': u.is_staff,
                'transaction_count': tx_count,
            })
            
        return Response({
            'total_users': total_users,
            'total_transactions': total_transactions,
            'total_volume': total_volume,
            'users': users_data
        })

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

    # Day 21: Analytics endpoint (monthly trend)
    @action(detail=False, methods=['get'])
    def monthly_trend(self, request):
        expenses = self.get_queryset().filter(type='expense')
        trend = expenses.annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            total=Sum('amount')
        ).order_by('month')
        
        formatted_trend = []
        for item in trend:
            if item['month']:
                formatted_trend.append({
                    'month': item['month'].strftime('%b %Y'),
                    'total': item['total']
                })
        return Response(formatted_trend)

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

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer

class AdminCategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]

class AdminBudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAdminUser]
