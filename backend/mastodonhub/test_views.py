from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from django.utils import timezone
from .models import mastodonhubClubs, mastodonhubEvents, mastodonhubDashboard, Blog
from django.core.files.uploadedfile import SimpleUploadedFile

class DashboardViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dashboard = mastodonhubDashboard.objects.create(
            Title='Test Dashboard',
            Description='Test Description',
            ImageUrl='https://example.com/image.jpg'
        )
        self.url = '/api/mastodonhub/dashboard/'

    def test_get_dashboard(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class EventsViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.event = mastodonhubEvents.objects.create(
            Title='Test Event',
            Description='Test Description',
            Location='Test Location',
            Date=timezone.now().date(),
            StartTime=timezone.now().time(),
            EndTime=timezone.now().time(),
            ImageUrl='https://example.com/image.jpg',
            Category='Academic'
        )
        self.url = '/api/mastodonhub/events/'

    def test_get_events(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class ClubsViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.club = mastodonhubClubs.objects.create(
            Title='Test Club',
            PresidentName='John Doe',
            TreasurerName='Jane Smith',
            AdvisorName='Dr. Johnson',
            Email='club@example.com',
            ImageUrl='https://example.com/image.jpg',
            Category='Academic'
        )
        
        # Create regular user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        
        # Create staff user
        self.staff_user = User.objects.create_user(
            username='staffuser',
            password='staffpassword',
            is_staff=True
        )
        
        self.url = '/api/mastodonhub/clubs/'
        self.detail_url = f'/api/mastodonhub/clubs/{self.club.id}/'

    def test_get_clubs_list_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_get_club_detail_unauthenticated(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_create_club_unauthenticated(self):
        new_club = {
            'Title': 'New Club',
            'PresidentName': 'John Doe',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'newclub@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }
        response = self.client.post(self.url, new_club, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_club_authenticated_regular_user(self):
        self.client.force_authenticate(user=self.user)
        new_club = {
            'Title': 'New Club',
            'PresidentName': 'John Doe',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'newclub@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }
        response = self.client.post(self.url, new_club, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_create_club_authenticated_staff_user(self):
        self.client.force_authenticate(user=self.staff_user)
        new_club = {
            'Title': 'New Club',
            'PresidentName': 'John Doe',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'newclub@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }
        response = self.client.post(self.url, new_club, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_update_club_authenticated_staff_user(self):
        self.client.force_authenticate(user=self.staff_user)
        updated_data = {
            'Title': 'Updated Club',
            'PresidentName': 'John Doe Updated',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'updated@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }
        response = self.client.put(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Title'], 'Updated Club')
        
    def test_delete_club_authenticated_staff_user(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_update_club_authenticated_regular_user(self):
        self.client.force_authenticate(user=self.user)
        updated_data = {
            'Title': 'Updated Club',
            'PresidentName': 'John Doe Updated',
            'TreasurerName': 'Jane Smith',
            'AdvisorName': 'Dr. Johnson',
            'Email': 'updated@example.com',
            'ImageUrl': 'https://example.com/image.jpg',
            'Category': 'Academic'
        }
        response = self.client.put(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_delete_club_authenticated_regular_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class BlogListCreateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.event = mastodonhubEvents.objects.create(
            Title='Test Event',
            Description='Test Description',
            Location='Test Location',
            Date=timezone.now().date(),
            StartTime=timezone.now().time(),
            EndTime=timezone.now().time(),
            ImageUrl='https://example.com/image.jpg',
            Category='Academic'
        )
        
        self.blog = Blog.objects.create(
            title='Test Blog',
            content='Test Blog Content',
            rating=4,
            event=self.event
        )
        
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        
        self.url = '/api/mastodonhub/blogs/'
        
    def test_get_blogs_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_create_blog_unauthenticated(self):
        new_blog = {
            'title': 'New Blog',
            'content': 'New Blog Content',
            'rating': 5,
            'event': self.event.id
        }
        response = self.client.post(self.url, new_blog, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_blog_authenticated(self):
        self.client.force_authenticate(user=self.user)
        new_blog = {
            'title': 'New Blog',
            'content': 'New Blog Content',
            'rating': 5,
            'event': self.event.id
        }
        response = self.client.post(self.url, new_blog, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class AdminStatusViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create regular user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        
        # Create staff user
        self.staff_user = User.objects.create_user(
            username='staffuser',
            password='staffpassword',
            is_staff=True
        )
        
        self.url = '/api/check-admin/'
        
    def test_check_admin_status_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_check_admin_status_regular_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_admin'], False)
        self.assertEqual(response.data['username'], 'testuser')
        
    def test_check_admin_status_staff_user(self):
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['is_admin'], True)
        self.assertEqual(response.data['username'], 'staffuser')
        
        
        
class UserProfileTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', email='old@example.com', password='pass')
        self.client.force_authenticate(user=self.user)
        self.get_url = '/profile/'
        self.update_url = '/profile/update/'

    def test_get_profile(self):
        response = self.client.get(self.get_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_update_profile(self):
        data = {'first_name': 'Roshini'}
        response = self.client.put(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Roshini')


class ProfilePictureUploadTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='picuser', password='pass')
        self.client.force_authenticate(user=self.user)
        self.url = '/profile/picture/'

    def test_upload_valid_picture(self):
        image = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        response = self.client.post(self.url, {'profile_picture': image}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('profile_picture_url', response.data)

    def test_upload_no_file(self):
        response = self.client.post(self.url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
