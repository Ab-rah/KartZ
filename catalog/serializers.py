# serializers.py
from rest_framework import serializers
from .models import Product, Category
import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'created_at']
        read_only_fields = ['slug', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    owner_username = serializers.ReadOnlyField(source='owner.email')
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )

    # Image handling
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'owner', 'owner_username', 'category', 'category_id',
            'title', 'slug', 'description', 'price', 'stock', 'is_active',
            'image', 'image_url', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'owner', 'owner_username', 'created_at', 'updated_at']

    def _generate_guid_filename(self, original_filename, existing_uuid=None):
        """
        Generate a GUID-based filename preserving the file extension.
        If an existing UUID is provided, reuse it.
        """
        ext = os.path.splitext(original_filename)[1] or '.jpg'
        guid = existing_uuid or str(uuid.uuid4())
        print(f"Generated GUID: {guid} with extension: {ext}")
        return f"{guid}{ext}"

    def get_image_url(self, obj):
        """Return full URL for the image"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


    def create(self, validated_data):
        """
        Handle product creation with UUID-based image naming.
        """
        image = validated_data.get("image", None)
        if image and hasattr(image, 'name'):
            # Always assign new UUID on create
            new_filename = self._generate_guid_filename(image.name)
            print(new_filename)
            image.name = new_filename

        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Handle product update with UUID-based image replacement.
        If a new image is uploaded, reuse existing UUID if possible.
        """
        new_image = validated_data.get("image", None)

        if new_image and hasattr(new_image, 'name'):
            # --- 1. Extract existing UUID ---
            existing_uuid = None
            if instance.image:
                existing_image_name = os.path.basename(instance.image.name)
                existing_uuid = os.path.splitext(existing_image_name)[0]  # 'uuid.ext' → 'uuid'

                # --- 2. Delete old image safely ---
                if default_storage.exists(instance.image.name):
                    default_storage.delete(instance.image.name)

            # --- 3. Assign new name with existing or new UUID ---
            new_filename = self._generate_guid_filename(new_image.name, existing_uuid)
            new_image.name = new_filename

        return super().update(instance, validated_data)

# Lightweight serializer for dropdown lists
class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name','slug']


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for product lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    owner_username = serializers.CharField(source='owner.email', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'price', 'stock', 'is_active',
            'category_name', 'owner_username', 'image_url', 'created_at'
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None