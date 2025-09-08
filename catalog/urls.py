from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListCreateAPIView.as_view(), name='product-list'),
    path('products/<slug:slug>/', views.ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),
]