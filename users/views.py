from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .serializers import SignupSerializer
from .serializers import AdminUserSerializer
from django.contrib.auth import get_user_model
from .models import User
from drf_spectacular.utils import extend_schema

class SignupView(generics.CreateAPIView):
    """Anyone can sign up as a customer"""
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=SignupSerializer,
        responses=SignupSerializer,
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class UserManagementView(generics.ListCreateAPIView):
    """Only Admins can view or create admin accounts"""
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]