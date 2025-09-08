from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from catalog.models import Product


class ProductPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            email="u1@example.com", password="pass1234", first_name="U1", last_name="Test"
        )
        self.user2 = User.objects.create_user(
            email="u2@example.com", password="pass1234", first_name="U2", last_name="Test"
        )
        self.admin = User.objects.create_superuser(
            email="admin@example.com", password="adminpass", first_name="Admin", last_name="Test"
        )
        self.product = Product.objects.create(
            title="Test Product",
            description="Test Desc",
            price=100.00,
            stock=5,
            owner=self.user1
        )

    def test_owner_can_update(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(f"/api/catalog/products/{self.product.id}/", {"price": 200})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_other_user_cannot_delete(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(f"/api/catalog/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_delete_any_product(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/catalog/products/{self.product.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)