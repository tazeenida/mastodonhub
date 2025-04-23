from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User
from authentification.views import (
    LogoutView, SignUpView, get_user_details, PasswordResetRequestView,
    PasswordResetConfirmView, ChangePasswordView, SecurityQuestionView, check_admin_status
)
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

class DirectViewTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        
    def test_logout_view(self):
        """Test LogoutView directly"""
        view = LogoutView.as_view()
        request = self.factory.post('/logout/')
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
    def test_signup_view(self):
        """Test SignUpView directly"""
        view = SignUpView.as_view()
        
        # Test with valid data
        request = self.factory.post('/signup/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123'
        }, format='json')
        response = view(request)
        self.assertEqual(response.status_code, 201)
        
        # Test with missing fields
        request = self.factory.post('/signup/', {
            'username': 'testuser2'
        }, format='json')
        response = view(request)
        self.assertEqual(response.status_code, 400)
        
        # Test with existing username
        request = self.factory.post('/signup/', {
            'username': 'testuser',
            'email': 'different@example.com',
            'password': 'password123'
        }, format='json')
        response = view(request)
        self.assertEqual(response.status_code, 400)
        
        # Test with existing email
        request = self.factory.post('/signup/', {
            'username': 'different',
            'email': 'test@example.com',
            'password': 'password123'
        }, format='json')
        response = view(request)
        self.assertEqual(response.status_code, 400)
    
    def test_get_user_details(self):
        """Test get_user_details function directly"""
        # Test GET
        request = self.factory.get('/user-profile/')
        force_authenticate(request, user=self.user)
        response = get_user_details(request)
        self.assertEqual(response.status_code, 200)
        
        # Test PUT
        request = self.factory.put('/user-profile/')
        force_authenticate(request, user=self.user)
        response = get_user_details(request)
        self.assertEqual(response.status_code, 200)
        
    def test_change_password_view(self):
        """Test ChangePasswordView directly"""
        view = ChangePasswordView.as_view()
        
        # Test with valid data
        request = self.factory.post('/change-password/', {
            'current_password': 'testpassword123',
            'new_password': 'newpassword456'
        }, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
        # Test with invalid password
        request = self.factory.post('/change-password/', {
            'current_password': 'wrongpassword',
            'new_password': 'newpassword456'
        }, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, 400)