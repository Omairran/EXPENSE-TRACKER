from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default="#000000") # Hex color code

    def __str__(self):
        return self.name

class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='expense')
    merchant = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.type.capitalize()} - {self.amount} on {self.date}"

class Budget(models.Model):
    category = models.OneToOneField(Category, on_delete=models.CASCADE)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField(help_text="Month number (1-12)", null=True, blank=True)
    year = models.IntegerField(help_text="Year (e.g., 2026)", null=True, blank=True)

    def __str__(self):
        return f"Budget for {self.category.name}: {self.limit}"
