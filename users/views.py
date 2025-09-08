from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .serializers import SignupSerializer
from .serializers import AdminUserSerializer
from django.contrib.auth import get_user_model
from .models import User

class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

class UserManagementView(generics.ListCreateAPIView):
    """Only Admins can view or create admin accounts"""
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]