from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, filters
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsAdminOrOwnerOrReadOnly, IsAdminOrReadOnly

# Products
class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category','owner')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title','description','category__name','owner__username']
    ordering_fields = ['price','created_at']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related('category','owner')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrOwnerOrReadOnly]
    lookup_field = 'slug'


# Categories
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'