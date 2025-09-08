from django.urls import path
from . import views

urlpatterns = [
    path('', views.CartView.as_view(), name='cart-detail'),
    path('add/', views.CartAddItemView.as_view(), name='cart-add'),
    path('items/<int:pk>/', views.CartItemUpdateDeleteView.as_view(), name='cart-item-update-delete'),
]