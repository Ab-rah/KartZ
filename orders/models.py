from django.db import models
from django.conf import settings
from catalog.models import Product
from decimal import Decimal


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    shipping_address = models.TextField(blank=True, null=True)
    payment_status = models.CharField(max_length=30, default='unpaid')
    payment_reference = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Order {self.pk} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)


from django.db import models

# Create your models here.
