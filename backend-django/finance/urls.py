from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, BudgetViewSet, RegisterView, AdminDashboardView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('admin-dashboard/overview/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('', include(router.urls)),
]
