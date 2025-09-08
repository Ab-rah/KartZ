from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from catalog.models import Product
from django.shortcuts import get_object_or_404


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartAddItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        qty = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, pk=product_id, is_active=True)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product,
                                                       defaults={'quantity': qty, 'price': product.price})
        if not created:
            item.quantity += qty
            item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CartItemUpdateDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        qty = int(request.data.get('quantity', item.quantity))
        if qty <= 0:
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        item.quantity = qty
        item.save()
        return Response({'detail': 'updated'})

    def delete(self, request, pk):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        item = get_object_or_404(CartItem, pk=pk, cart=cart)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from django.shortcuts import render

# Create your views here.
