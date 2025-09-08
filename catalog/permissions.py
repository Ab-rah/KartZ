from rest_framework import permissions

class IsAdminOrOwnerOrReadOnly(permissions.BasePermission):
    """
    Safe methods allowed to any. Unsafe allowed only to object owner or admin.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_staff:
            return True
        return getattr(obj, 'owner', None) == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff