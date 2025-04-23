from django.test import TestCase, override_settings
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import User
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
import tempfile
import os

from .models import mastodonhubClubs, mastodonhubEvents, mastodonhubDashboard, Blog, UserProfile
from .serializers import (
    ClubsSerializer, EventsSerializer, DashboardSerializer, 
    BlogSerializer, UserProfileSerializer, UserSerializer
)

@override_settings(MEDIA_ROOT=tempfile.mkdtemp(), MEDIA_URL='/media/')
class UserProfileSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser')
        self.profile = UserProfile.objects.get(user=self.user)
        
    def test_valid_profile_picture(self):
        """Test valid image upload"""
        image = Image.new('RGB', (100, 100))
        tmp_file = BytesIO()
        image.save(tmp_file, 'JPEG')
        tmp_file.seek(0)
        
        image_file = SimpleUploadedFile(
            'test.jpg',
            tmp_file.read(),
            content_type='image/jpeg'
        )
        
        data = {'profile_picture': image_file}
        serializer = UserProfileSerializer(instance=self.profile, data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

@override_settings(MEDIA_ROOT=tempfile.mkdtemp(), MEDIA_URL='/media/')
class UserSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        self.profile = UserProfile.objects.get(user=self.user)
        
    def test_user_serialization(self):
        """Test basic user serialization"""
        serializer = UserSerializer(instance=self.user)
        self.assertEqual(serializer.data['username'], 'testuser')



        
    def test_name_validation(self):
        """Test name length validation"""
        serializer = UserSerializer(data={
            'username': 'newuser',
            'email': 'new@example.com',
            'first_name': 'A very long first name that exceeds thirty characters',
            'last_name': 'User'
        })
        if serializer.is_valid():
            self.assertLessEqual(len(serializer.validated_data['first_name']), 30)



class ClubsSerializerTest(TestCase):
    def setUp(self):
        self.valid_club_data = {
            'Title': 'Test Club',
            'PresidentName': 'John Doe',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'club@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic',
            'Description': 'Test description'
        }

    def test_valid_club_serializer(self):
        serializer = ClubsSerializer(data=self.valid_club_data)
        self.assertTrue(serializer.is_valid())
        
    def test_description_field(self):
        data = self.valid_club_data.copy()
        data.pop('Description', None)
        serializer = ClubsSerializer(data=data)
        self.assertTrue(serializer.is_valid())

class EventsSerializerTest(TestCase):
    def setUp(self):
        self.event_data = {
            'Title': 'Test Event',
            'Description': 'Test Description',
            'Location': 'Test Location',
            'Date': '2023-01-01',
            'StartTime': '10:00:00',
            'EndTime': '12:00:00',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }

    def test_valid_event_serializer(self):
        serializer = EventsSerializer(data=self.event_data)
        self.assertTrue(serializer.is_valid())
        
    def test_missing_required_fields(self):
        required_fields = ['Title', 'Description', 'Location', 'Date', 
                         'StartTime', 'EndTime', 'Category']
        
        for field in required_fields:
            data = self.event_data.copy()
            data.pop(field)
            serializer = EventsSerializer(data=data)
            self.assertFalse(serializer.is_valid())

class BlogSerializerTest(TestCase):
    def setUp(self):
        self.event = mastodonhubEvents.objects.create(
            Title='Test Event',
            Description='Test Description',
            Location='Test Location',
            Date='2023-01-01',
            StartTime='10:00:00',
            EndTime='12:00:00',
            ImageUrl='https://example.com/image.jpg',
            Category='Academic'
        )
        self.blog_data = {
            'title': 'Test Blog',
            'content': 'Test Content',
            'rating': 4,
            'event': self.event.id
        }

    def test_valid_blog_serializer(self):
        serializer = BlogSerializer(data=self.blog_data)
        self.assertTrue(serializer.is_valid())
        
    def test_created_at_read_only(self):
        serializer = BlogSerializer(data={
            'title': 'Test Blog',
            'content': 'Content',
            'rating': 3,
            'event': self.event.id,
            'created_at': '2023-01-01T00:00:00Z'
        })
        self.assertTrue(serializer.is_valid())
        self.assertNotIn('created_at', serializer.validated_data)