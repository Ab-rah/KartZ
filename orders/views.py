from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db import transaction
from decimal import Decimal
from cart.models import Cart, CartItem
from catalog.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer
from django.shortcuts import get_object_or_404
from .tasks import send_order_confirmation_email


class CheckoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        cart, _ = Cart.objects.select_for_update().get_or_create(user=request.user)
        items = list(cart.items.select_related('product').all())

        if not items:
            return Response({"detail": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Lock products to avoid race conditions
        product_pks = [it.product.pk for it in items]
        products = Product.objects.select_for_update().filter(pk__in=product_pks)

        # verify stock
        for it in items:
            product = it.product
            if it.quantity > product.stock:
                return Response({
                    "detail": f"Not enough stock for {product.title}. Available: {product.stock}"
                }, status=status.HTTP_400_BAD_REQUEST)

        total = Decimal('0.00')
        for it in items:
            total += it.price * it.quantity

        # Here: integrate Stripe or mock payment.
        # For now, we'll do a mock payment (set payment_status to 'paid')
        payment_status = 'paid'
        payment_reference = 'MOCK-' + str(request.user.id) + '-' + str(int(Order.objects.count()) + 1)

        order = Order.objects.create(
            user=request.user,
            total=total,
            shipping_address=request.data.get('shipping_address', ''),
            payment_status=payment_status,
            payment_reference=payment_reference,
            status='processing'
        )

        for it in items:
            OrderItem.objects.create(
                order=order,
                product=it.product,
                quantity=it.quantity,
                price=it.price,
                subtotal=it.price * it.quantity
            )
            # decrement stock
            p = it.product
            p.stock = p.stock - it.quantity
            if p.stock < 0:
                raise ValueError("Stock went negative")
            p.save()

        # clear cart
        cart.items.all().delete()

        # trigger email via celery (non-blocking)
        try:
            send_order_confirmation_email.delay(order.id)
        except Exception:
            # if Celery not configured, ignore but log in real app
            pass

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class OrderListAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        print("Fetching orders for user:", user.email)
        orders = Order.objects.filter(user=user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from django.shortcuts import render

# Create your views here.
