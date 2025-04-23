from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name'] 
        
        
        
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class SecurityQuestionSerializer(serializers.Serializer):
    security_question = serializers.CharField(required=True)
    security_answer = serializers.CharField(required=True)