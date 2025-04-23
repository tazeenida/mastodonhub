from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User
from authentification.views import (
    get_user_details, check_admin_status, ChangePasswordView, SecurityQuestionView
)

class AuthViewsFixed(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.admin_user = User.objects.create_user(
            username='adminuser',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
        
    def test_get_user_details_fixed(self):
        """Test get_user_details with proper authentication"""
        request = self.factory.get('/user-profile/')
        force_authenticate(request, user=self.user)
        response = get_user_details(request)
        self.assertEqual(response.status_code, 200)
        
        # Test PUT
        request = self.factory.put('/user-profile/')
        force_authenticate(request, user=self.user)
        response = get_user_details(request)
        self.assertEqual(response.status_code, 200)
    
    def test_check_admin_status_fixed(self):
        """Test check_admin_status with proper authentication"""
        # Regular user
        request = self.factory.get('/api/check-admin/')
        force_authenticate(request, user=self.user)
        response = check_admin_status(request)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_admin'])
        
        # Admin user
        request = self.factory.get('/api/check-admin/')
        force_authenticate(request, user=self.admin_user)
        response = check_admin_status(request)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_admin'])
    
    def test_change_password_fixed(self):
        """Test ChangePasswordView with proper authentication"""
        view = ChangePasswordView.as_view()
        request = self.factory.post('/change-password/', {
            'current_password': 'testpassword123',
            'new_password': 'newpassword456'
        }, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, 200)
        
    def test_security_question_fixed(self):
        """Test SecurityQuestionView with proper authentication"""
        view = SecurityQuestionView.as_view()
        request = self.factory.post('/security-question/', {
            'security_question': 'What is your favorite color?',
            'security_answer': 'blue'
        }, format='json')
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, 200)