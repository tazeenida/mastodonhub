from django.test import TestCase
from authentification.serializers import ChangePasswordSerializer, SecurityQuestionSerializer

class AuthSerializersTests(TestCase):
    def test_change_password_serializer_valid(self):
        """Test ChangePasswordSerializer with valid data"""
        data = {
            'current_password': 'currentpass',
            'new_password': 'newpassword123'
        }
        serializer = ChangePasswordSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_change_password_serializer_invalid(self):
        """Test ChangePasswordSerializer with invalid data"""
        # Missing new_password
        data = {'current_password': 'currentpass'}
        serializer = ChangePasswordSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('new_password', serializer.errors)

    def test_security_question_serializer_valid(self):
        """Test SecurityQuestionSerializer with valid data"""
        data = {
            'security_question': 'What was your first pet name?',
            'security_answer': 'Fluffy'
        }
        serializer = SecurityQuestionSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_security_question_serializer_invalid(self):
        """Test SecurityQuestionSerializer with invalid data"""
        # Missing security_answer
        data = {'security_question': 'What was your first pet name?'}
        serializer = SecurityQuestionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('security_answer', serializer.errors)
        