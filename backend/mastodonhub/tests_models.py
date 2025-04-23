from django.test import TestCase
from .models import mastodonhubEvents, mastodonhubClubs, UserProfile, Blog
from django.contrib.auth.models import User

class ModelsTestCase(TestCase):
    def setUp(self):
        # Create test users - the signal will automatically create profiles
        self.user1 = User.objects.create_user(username='testuser1')
        self.user2 = User.objects.create_user(username='testuser2')
        
    def test_event_creation(self):
        event = mastodonhubEvents.objects.create(
            Title="Test Event",
            Description="Test Description",
            Location="Test Location",
            Date="2023-01-01",
            StartTime="10:00:00",
            EndTime="12:00:00",
            ImageUrl="http://example.com/image.jpg",
            Category="Test"
        )
        self.assertEqual(str(event), "Test Event")
        
    def test_club_creation(self):
        club = mastodonhubClubs.objects.create(
            Title="Test Club",
            PresidentName="Test President",
            TreasurerName="Test Treasurer",
            AdvisorName="Test Advisor",
            Email="test@example.com",
            ImageUrl="http://example.com/image.jpg",
            Category="Test",
            Description="Test Description"
        )
        self.assertEqual(str(club), "Test Club")
        
    def test_user_profile_auto_creation(self):
        """Test that UserProfile is automatically created"""
        self.assertTrue(hasattr(self.user1, 'profile'))
        self.assertEqual(str(self.user1.profile), "testuser1's Profile")
        
    def test_blog_creation(self):
        event = mastodonhubEvents.objects.create(
            Title="Test Event",
            Description="Test Description",
            Location="Test Location",
            Date="2023-01-01",
            StartTime="10:00:00",
            EndTime="12:00:00",
            ImageUrl="http://example.com/image.jpg",
            Category="Test"
        )
        blog = Blog.objects.create(
            title="Test Blog",
            content="Test Content",
            rating=5,
            event=event
        )
        self.assertEqual(str(blog), "Test Blog")