from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name','slug','description']


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            'id','owner','category','category_id','title','slug','description',
            'price','stock','is_active','image','created_at','updated_at'
        ]
        read_only_fields = ['id','slug','owner','created_at','updated_at']

        def get_image(self, obj):
            request = self.context.get('request')
            if obj.image and request:
                return request.build_absolute_uri(obj.image.url)
            elif obj.image:
                return obj.image.url  # relative
            return None

