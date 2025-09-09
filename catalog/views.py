# views.py
from django.shortcuts import render
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Product, Category
from .serializers import (
    ProductSerializer, CategorySerializer,
    CategoryListSerializer, ProductListSerializer
)
from .permissions import IsAdminOrOwnerOrReadOnly, IsAdminOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
import logging

logger = logging.getLogger(__name__)


class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=False).select_related('category', 'owner')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Enable file upload
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category__name', 'owner__email']
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Use different serializers for list and create"""
        if self.request.method == 'GET':
            return ProductListSerializer
        return ProductSerializer

    @extend_schema(
        operation_id='list_products',
        description='Get list of all active products',
        responses={200: ProductListSerializer(many=True)},
        parameters=[
            OpenApiParameter(
                name='search',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Search in title, description, category name, or owner username'
            ),
            OpenApiParameter(
                name='ordering',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description='Order by: price, -price, created_at, -created_at'
            ),
        ]
    )
    def get(self, request, *args, **kwargs):
        """List all products"""
        return super().list(request, *args, **kwargs)

    @extend_schema(
        operation_id='create_product',
        description='Create a new product with optional image upload',
        request=ProductSerializer,
        responses={
            201: ProductSerializer,
            400: OpenApiTypes.OBJECT
        },
        examples=[
            OpenApiExample(
                'Product with Image',
                summary='Create product with image upload',
                description='Example of creating a product with image file upload',
                value={
                    'title': 'iPhone 15 Pro',
                    'description': 'Latest iPhone with advanced features',
                    'price': '999.99',
                    'stock': 50,
                    'category_id': 1,
                    'image_file': 'Upload image file here'
                },
                request_only=True,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        """Create a new product with image upload support"""
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        """Set the owner when creating a product"""
        try:
            serializer.save(owner=self.request.user)
            logger.info(f"Product created by user {self.request.user.email}")
        except Exception as e:
            logger.error(f"Error creating product: {e}")
            raise


class ProductRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related('category', 'owner')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = 'slug'

    @extend_schema(
        operation_id='get_product',
        description='Get product details by slug',
        responses={200: ProductSerializer}
    )
    def get(self, request, *args, **kwargs):
        """Retrieve a product"""
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        operation_id='update_product',
        description='Update product with optional image upload',
        request=ProductSerializer,
        responses={200: ProductSerializer},
        examples=[
            OpenApiExample(
                'Update with New Image',
                summary='Update product with new image',
                description='Update product fields and replace image',
                value={
                    'title': 'Updated iPhone 15 Pro',
                    'price': '899.99',
                    'image_file': 'Upload new image file here'
                },
                request_only=True,
            )
        ]
    )
    def put(self, request, *args, **kwargs):
        """Update product with image upload support"""
        return super().update(request, *args, **kwargs)

    @extend_schema(
        operation_id='partial_update_product',
        description='Partially update product with optional image upload',
        request=ProductSerializer,
        responses={200: ProductSerializer}
    )
    def patch(self, request, *args, **kwargs):
        """Partially update product with image upload support"""
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        operation_id='delete_product',
        description='Delete a product',
        responses={204: None}
    )
    def delete(self, request, *args, **kwargs):
        """Delete a product"""
        return super().destroy(request, *args, **kwargs)


# Categories
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        """Use lightweight serializer for GET requests"""
        if self.request.method == 'GET':
            return CategoryListSerializer
        return CategorySerializer

    @extend_schema(
        operation_id='list_categories',
        description='Get list of all categories',
        responses={200: CategoryListSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        """List all categories"""
        return super().list(request, *args, **kwargs)

    @extend_schema(
        operation_id='create_category',
        description='Create a new category',
        request=CategorySerializer,
        responses={201: CategorySerializer},
        examples=[
            OpenApiExample(
                'New Category',
                summary='Create a new category',
                value={
                    'name': 'Electronics',
                    'description': 'Electronic devices and gadgets'
                },
                request_only=True,
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        """Create a new category"""
        return super().create(request, *args, **kwargs)


class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'

    @extend_schema(
        operation_id='get_category',
        description='Get category details by slug',
        responses={200: CategorySerializer}
    )
    def get(self, request, *args, **kwargs):
        """Retrieve a category"""
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        operation_id='update_category',
        description='Update a category (admin only)',
        request=CategorySerializer,
        responses={200: CategorySerializer}
    )
    def put(self, request, *args, **kwargs):
        """Update a category"""
        return super().update(request, *args, **kwargs)

    @extend_schema(
        operation_id='partial_update_category',
        description='Partially update a category (admin only)',
        request=CategorySerializer,
        responses={200: CategorySerializer}
    )
    def patch(self, request, *args, **kwargs):
        """Partially update a category"""
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        operation_id='delete_category',
        description='Delete a category (admin only)',
        responses={204: None}
    )
    def delete(self, request, *args, **kwargs):
        """Delete a category"""
        return super().destroy(request, *args, **kwargs)


# Additional endpoint to get categories for dropdowns
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
@extend_schema(
    operation_id='category_choices',
    responses={200: CategoryListSerializer(many=True)},
    description="Get list of all categories for dropdown selection"
)
def category_choices(request):
    """Get all categories for dropdown selection"""
    categories = Category.objects.all().order_by('name')
    serializer = CategoryListSerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)