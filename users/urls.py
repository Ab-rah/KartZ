from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, UserManagementView


urlpatterns = [
path('signup/', SignupView.as_view(), name='signup'),
path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
path("manage/", UserManagementView.as_view(), name="user_management")
]