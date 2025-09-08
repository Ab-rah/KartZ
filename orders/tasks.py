from celery import shared_task
from django.core.mail import send_mail
from .models import Order
from django.conf import settings

@shared_task(bind=True)
def send_order_confirmation_email(self, order_id):
    try:
        order = Order.objects.get(pk=order_id)
        subject = f"Order Confirmation — #{order.id}"
        message = f"Hi {order.user},\n\nThanks for your order #{order.id}. Total: {order.total}\n\nWe will update you when it ships.\n\nThanks!"
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [order.user.email])
        return True
    except Order.DoesNotExist:
        return False