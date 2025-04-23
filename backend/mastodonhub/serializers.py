from rest_framework import serializers
from .models import mastodonhubEvents, mastodonhubClubs, mastodonhubDashboard, Blog, UserProfile
from django.contrib.auth.models import User
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError as DjangoValidationError

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = mastodonhubDashboard
        fields = ('Title', 'Description', 'ImageUrl')

class EventsSerializer(serializers.ModelSerializer):
    class Meta:
        model = mastodonhubEvents
        fields = (
            'id', 'Title', 'Description', 'Location', 'Date',
            'StartTime', 'EndTime', 'ImageUrl', 'Category'
        )
    
    def validate_ImageUrl(self, value):
        # If ImageUrl is provided, validate it
        if value:
            # Truncate to 200 characters
            value = value[:200]
            # Validate URL if provided
            url_validator = URLValidator()
            try:
                url_validator(value)
            except DjangoValidationError:
                # If empty or not a valid URL, set to None or empty string
                value = ''
        return value
    
    def validate(self, data):
        """
        Additional validation for Events data
        """
        # Ensure required fields are not empty
        required_fields = ['Title', 'Description', 'Location', 'Date', 'StartTime', 'EndTime', 'ImageUrl', 'Category']
        for field in required_fields:
            if field not in data or data[field] in [None, '', []]:
                raise serializers.ValidationError({field: f"{field} cannot be empty."})
        return data

class ClubsSerializer(serializers.ModelSerializer):
    class Meta:
        model = mastodonhubClubs
        fields = (
            'id', 'Title', 'PresidentName', 'TreasurerName',
            'AdvisorName', 'Email', 'ImageUrl', 'Category', 'Description' # Added Description
        )
    
    def validate_ImageUrl(self, value):
        # If ImageUrl is provided, validate it
        if value:
            # Truncate to 200 characters
            value = value[:200]
            # Validate URL if provided
            url_validator = URLValidator()
            try:
                url_validator(value)
            except DjangoValidationError:
                # If empty or not a valid URL, set to None or empty string
                value = ''
        return value
    
    def validate(self, data):
        """
        Additional validation for clubs data
        """
        # Ensure required fields are not empty
        required_fields = ['Title', 'PresidentName', 'Email']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: f"{field} cannot be empty."})
        
        # Basic email validation
        if '@' not in data.get('Email', ''):
            raise serializers.ValidationError({'Email': "Invalid email format."})
        
        return data

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'rating', 'event', 'created_at']

# User Profile Serializers
class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserProfile model - handles profile picture
    """
    class Meta:
        model = UserProfile
        fields = ['profile_picture']
        
    def validate_profile_picture(self, value):
        # Validate file size (max 5MB)
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 5MB.")
        
        # Validate file type
        if value:
            content_type = value.content_type.lower()
            if content_type not in ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']:
                raise serializers.ValidationError("Only JPEG, PNG, and GIF images are allowed.")
        
        return value

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model - includes profile picture URL
    """
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_picture_url']
        read_only_fields = ['id', 'username', 'email']
    
    def get_profile_picture_url(self, obj):
        """
        Get the URL of the user's profile picture
        """
        try:
            if hasattr(obj, 'profile') and obj.profile.profile_picture:
                return obj.profile.profile_picture.url
        except Exception:
            pass
        return None
    
    def validate_first_name(self, value):
        # Ensure first name is not too long
        if value and len(value) > 30:
            value = value[:30]
        return value
    
    def validate_last_name(self, value):
        # Ensure last name is not too long
        if value and len(value) > 30:
            value = value[:30]
        return value