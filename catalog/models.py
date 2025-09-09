# models.py
from django.db import models
from django.conf import settings
from django.utils.text import slugify
import os
import uuid

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        print("=== Saving Category ===")
        if not self.slug:
            self.slug = slugify(self.name)[:140]
        super().save(*args, **kwargs)
        print("Saved Category:", self.name)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


def product_image_upload_path(instance, filename):
    """Generate upload path for product images"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Generate unique filename
    filename = f"{uuid.uuid4().hex}.{ext}"
    # Return upload path
    return os.path.join('product_images', filename)


class Product(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='products', on_delete=models.CASCADE
    )
    category = models.ForeignKey(
        Category, related_name='products', on_delete=models.SET_NULL, null=True, blank=True
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to=product_image_upload_path, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        print("=== Saving Product ===")
        if not self.slug:
            base_slug = slugify(self.title)[:240]  # Leave room for unique suffix
            slug = base_slug
            counter = 1
            # Ensure unique slug
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
        print("Saved product:", self.title)

    def delete(self, *args, **kwargs):
        # Delete image file when product is deleted
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title