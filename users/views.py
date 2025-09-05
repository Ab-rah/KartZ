from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .serializers import SignupSerializer


class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]