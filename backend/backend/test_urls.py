from django.urls import reverse, resolve
from django.test import TestCase

class URLTests(TestCase):
    def test_profile_url_resolution(self):
        url = reverse('get_profile')
        self.assertEqual(resolve(url).view_name, 'get_profile')
    
    def test_club_members_url_resolution(self):
        url = reverse('club_members', kwargs={'club_id': 1})
        self.assertEqual(resolve(url).view_name, 'club_members')