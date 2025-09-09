from django.urls import path
from . import views

urlpatterns = [
    # Products
    path('products/', views.ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<slug:slug>/', views.ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-detail'),

    # Categories
    path('categories/', views.CategoryListCreateAPIView.as_view(), name='category-list-create'),
    path('categories/<slug:slug>/', views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-detail'),

    # Additional endpoints
    path('category-choices/', views.category_choices, name='category-choices'),
    # path('categories/<int:category_id>/products/', views.products_by_category, name='products-by-category'),
]
