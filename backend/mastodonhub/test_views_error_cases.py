from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from mastodonhub.models import mastodonhubClubs
from django.core.files.uploadedfile import SimpleUploadedFile

class ViewErrorCasesTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='testuser', password='testpass')
        cls.admin = User.objects.create_superuser(username='admin', password='adminpass')
        cls.club = mastodonhubClubs.objects.create(
            Title='Test Club',
            PresidentName='Test',
            Email='test@example.com',
            TreasurerName='Test',
            AdvisorName='Test',
            ImageUrl='http://example.com',
            Category='Test'
        )

    def test_event_create_permissions(self):
        # Test unauthenticated
        response = self.client.post('/api/mastodonhub/events/', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test authenticated but not admin - accept either 401 or 403
        self.client.force_login(self.user)
        response = self.client.post('/api/mastodonhub/events/', {})
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_upload_profile_picture(self):
        # Test unauthenticated
        response = self.client.post('/profile/picture/', {})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Test authenticated but invalid file
        self.client.force_login(self.user)
        invalid_file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        response = self.client.post('/profile/picture/', {'profile_picture': invalid_file}, format='multipart')
        # Accept either 400 or 401 based on your implementation
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED])