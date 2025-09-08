from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User


class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass",
            first_name="Admin",
            last_name="User"
        )
        self.user = User.objects.create_user(
            email="user@example.com",
            password="userpass",
            first_name="Normal",
            last_name="User"
        )

    def test_signup_new_user(self):
        response = self.client.post(reverse("signup"), {
            "email": "new@example.com",
            "password": "newpass123",
            "first_name": "New",
            "last_name": "User"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_with_jwt(self):
        response = self.client.post(reverse("token_obtain_pair"), {
            "email": "user@example.com",
            "password": "userpass"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_admin_can_create_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse("user_management"), {
            "email": "managed@example.com",
            "password": "managedpass",
            "first_name": "Managed",
            "last_name": "User"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_non_admin_cannot_create_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse("user_management"), {
            "email": "hack@example.com",
            "password": "hackpass",
            "first_name": "Hack",
            "last_name": "User"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)