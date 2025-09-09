# permissions.py
from rest_framework import permissions


class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a product to edit it.
    Admin users can edit any product.
    """

    def has_permission(self, request, view):
        # Read permissions for any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only to the owner or admin
        return obj.owner == request.user or request.user.is_staff


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit.
    """

    def has_permission(self, request, view):
        # Read permissions for any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for admin users
        return request.user and request.user.is_staff