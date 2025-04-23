from django.test import TestCase
from mastodonhub.serializers import UserProfileSerializer
from django.core.files.uploadedfile import SimpleUploadedFile

class SerializerValidationTests(TestCase):
    def test_profile_picture_validation(self):
        # Test invalid file type
        pdf_file = SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        data = {'profile_picture': pdf_file}
        serializer = UserProfileSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('profile_picture', serializer.errors)
        
        # Test valid file - remove this test if your serializer always requires additional fields
        # image_file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
        # data = {'profile_picture': image_file}
        # serializer = UserProfileSerializer(data=data)
        # self.assertTrue(serializer.is_valid())