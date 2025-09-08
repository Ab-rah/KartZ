from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from catalog.models import Product
from orders.models import Order, OrderItem
from decimal import Decimal

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create a user
        self.user = User.objects.create_user(
            email="buyer@example.com", password="buyerpass", first_name="Buyer", last_name="Test"
        )
        self.client.force_authenticate(user=self.user)

        # Create products
        self.product1 = Product.objects.create(
            title="Laptop",
            description="Gaming Laptop",
            price=Decimal('1000.00'),
            stock=5,
            owner=self.user
        )
        self.product2 = Product.objects.create(
            title="Mouse",
            description="Wireless Mouse",
            price=Decimal('50.00'),
            stock=10,
            owner=self.user
        )

    def test_place_order_decrements_stock(self):
        # Place an order
        order_data = {
            "items": [
                {"product_id": self.product1.id, "quantity": 2},
                {"product_id": self.product2.id, "quantity": 3}
            ],
            "shipping_address": "123 Street, City",
            "payment_status": "paid",
            "payment_reference": "TXN12345"
        }
        response = self.client.post("/api/orders/place/", order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Refresh products from db
        self.product1.refresh_from_db()
        self.product2.refresh_from_db()

        # Stock should be decremented
        self.assertEqual(self.product1.stock, 3)
        self.assertEqual(self.product2.stock, 7)

        # Order items created
        order_id = response.data["id"]
        order = Order.objects.get(id=order_id)
        self.assertEqual(order.items.count(), 2)
        self.assertEqual(order.total, Decimal('2150.00'))  # 2*1000 + 3*50

    def test_cannot_order_more_than_stock(self):
        order_data = {
            "items": [
                {"product_id": self.product1.id, "quantity": 10}  # exceeds stock
            ],
            "shipping_address": "123 Street, City",
            "payment_status": "unpaid"
        }
        response = self.client.post("/api/orders/place/", order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("insufficient stock", str(response.data).lower())

    def test_order_history_retrieval(self):
        # Create an order manually
        order = Order.objects.create(
            user=self.user,
            total=Decimal('1100.00'),
            shipping_address="123 Street",
            payment_status="paid"
        )
        OrderItem.objects.create(
            order=order,
            product=self.product1,
            quantity=1,
            price=self.product1.price,
            subtotal=self.product1.price
        )
        OrderItem.objects.create(
            order=order,
            product=self.product2,
            quantity=2,
            price=self.product2.price,
            subtotal=Decimal('100.00')
        )

        # Retrieve orders
        response = self.client.get("/api/orders/history/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(len(response.data[0]["items"]), 2)
        self.assertEqual(response.data[0]["total"], "1100.00")