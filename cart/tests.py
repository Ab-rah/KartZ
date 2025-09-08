from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from catalog.models import Product
from cart.models import CartItem


class CartTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="cart@example.com", password="cartpass", first_name="Cart", last_name="Tester"
        )
        self.client.force_authenticate(user=self.user)
        self.product = Product.objects.create(
            title="Phone",
            description="Smartphone",
            price=500,
            stock=10,
            owner=self.user
        )

    def test_add_item_to_cart(self):
        response = self.client.post("/api/cart/add/", {"product_id": self.product.id, "quantity": 2})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CartItem.objects.count(), 1)

    def test_update_item_quantity(self):
        item = CartItem.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.patch(f"/api/cart/update/{item.id}/", {"quantity": 5})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.quantity, 5)

    def test_remove_item_from_cart(self):
        item = CartItem.objects.create(user=self.user, product=self.product, quantity=1)
        response = self.client.delete(f"/api/cart/remove/{item.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CartItem.objects.count(), 0)