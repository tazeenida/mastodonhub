from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from django.contrib.auth.models import User
from mastodonhub.views import get_profile, update_profile
from mastodonhub.models import UserProfile
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
import os
import shutil
import tempfile

class ProfileDirectTests(TestCase):
    def setUp(self):
        # Create a temporary directory for media
        self.temp_dir = tempfile.mkdtemp()
        settings.MEDIA_ROOT = self.temp_dir
        
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        # Create a profile for the user
        self.profile = UserProfile.objects.get(user=self.user)
    
    def tearDown(self):
        # Remove temporary directory
        shutil.rmtree(self.temp_dir)
    
    def test_get_profile_direct(self):
        """Test get_profile function directly"""
        request = self.factory.get('/profile/')
        request.build_absolute_uri = lambda x: f'http://testserver{x}'
        force_authenticate(request, user=self.user)
        
        response = get_profile(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'testuser')
    
    def test_update_profile_direct(self):
        """Test update_profile function directly"""
        request = self.factory.put('/profile/update/', {
            'first_name': 'Test',
            'last_name': 'User'
        }, format='json')
        request.data = {
            'first_name': 'Test',
            'last_name': 'User'
        }
        request.build_absolute_uri = lambda x: f'http://testserver{x}'
        force_authenticate(request, user=self.user)
        
        response = update_profile(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], 'Test')
        self.assertEqual(response.data['last_name'], 'User')