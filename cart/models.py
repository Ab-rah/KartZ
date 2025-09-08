from django.db import models
from django.conf import settings
from catalog.models import Product
from decimal import Decimal


class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    updated_at = models.DateTimeField(auto_now=True)

    def total(self):
        total = Decimal('0.00')
        for item in self.items.all():
            total += item.subtotal
        return total

    def __str__(self):
        return f"Cart({self.user})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot

    class Meta:
        unique_together = ('cart', 'product')

    @property
    def subtotal(self):
        return self.price * self.quantity


from django.db import models

# Create your models here.
