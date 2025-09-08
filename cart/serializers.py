from rest_framework import serializers
from .models import Cart, CartItem
from catalog.serializers import ProductSerializer
from .models import Product  # make sure Product is imported

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    #
    # will set in __init__

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id','product','product_id','quantity','price','subtotal']
        read_only_fields = ['id','product','price','subtotal']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from catalog.models import Product
        self.fields['product_id'].queryset = Product.objects.all()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id','user','items','total']
        read_only_fields = ['id','user','items','total']

    def get_total(self, obj):
        return obj.total()