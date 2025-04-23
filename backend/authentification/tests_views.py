from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
import json

class AuthViewsTestCase(APITestCase):
    def setUp(self):
        self.client = Client()
        self.api_client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword123'
        )
        
    # Existing tests
    def test_token_obtain(self):
        """Test that a token can be obtained with valid credentials"""
        url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertTrue('access' in response_data)
        self.assertTrue('refresh' in response_data)
        
    def test_token_refresh(self):
        """Test token refresh functionality"""
        token_url = reverse('token_obtain_pair')
        data = {'username': 'testuser', 'password': 'testpassword123'}
        response = self.client.post(token_url, data=json.dumps(data), content_type='application/json')
        refresh_token = response.json()['refresh']
        
        refresh_url = reverse('token_refresh')
        data = {'refresh': refresh_token}
        response = self.client.post(refresh_url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('access' in response.json())
        
    def test_profile_get(self):
        """Test profile retrieval"""
        self.api_client.force_authenticate(user=self.user)
        url = reverse('user_profile')
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        
    def test_profile_update(self):
        """Test profile update"""
        self.api_client.force_authenticate(user=self.user)
        url = reverse('user_profile')
        data = {
            'first_name': 'Updated',
            'last_name': 'User',
            'email': 'updated@example.com'
        }
        response = self.api_client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Profile updated successfully.')
        
    def test_unauthorized_access(self):
        """Test unauthorized access to profile"""
        url = reverse('user_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # New tests for increased coverage
    def test_signup_success(self):
        """Test successful user signup"""
        url = reverse('signUp')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_signup_missing_fields(self):
        """Test signup with missing required fields"""
        url = reverse('signUp')
        data = {'username': 'incomplete'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_duplicate_username(self):
        """Test signup with duplicate username"""
        url = reverse('signUp')
        data = {
            'username': 'testuser',  # Already exists
            'email': 'new@example.com',
            'password': 'password123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_reset_request(self):
        """Test password reset request"""
        url = reverse('password_reset_request')
        data = {'email': 'test@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_invalid_email(self):
        """Test password reset with invalid email"""
        url = reverse('password_reset_request')
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password(self):
        """Test changing password"""
        self.api_client.force_authenticate(user=self.user)
        url = reverse('change_password')
        data = {
            'current_password': 'testpassword123',
            'new_password': 'newpassword123'
        }
        response = self.api_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_password_wrong_current(self):
        """Test changing password with wrong current password"""
        self.api_client.force_authenticate(user=self.user)
        url = reverse('change_password')
        data = {
            'current_password': 'wrongpassword',
            'new_password': 'newpassword123'
        }
        response = self.api_client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_admin_status(self):
        """Test checking admin status"""
        self.api_client.force_authenticate(user=self.admin)
        url = reverse('check_admin')
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['is_admin'])