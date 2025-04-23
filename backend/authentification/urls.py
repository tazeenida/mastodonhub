from django.urls import path
from .views import (
    LogoutView, SignUpView, get_user_details, check_admin_status,
    PasswordResetRequestView, PasswordResetConfirmView, ChangePasswordView, SecurityQuestionView
)

urlpatterns = [
    path('logout/', LogoutView.as_view(), name='logout'),
    path('signUp/', SignUpView.as_view(), name='signUp'),
    path('user-profile/', get_user_details, name='user_profile'),
    path('api/check-admin/', check_admin_status, name='check_admin'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('security-question/', SecurityQuestionView.as_view(), name='security_question'),
]