from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from django.conf import settings
import os
import traceback

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get the authenticated user's profile data
    """
    user = request.user
    print(f"Fetching profile for user: {user.username}")
    
    # Prepare profile data
    profile_data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name or '',
        'last_name': user.last_name or '',
    }
    
    # Add profile picture URL if available
    try:
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        print(f"Profile {'created' if created else 'retrieved'} for user: {user.username}")
        
        if profile.profile_picture and profile.profile_picture.name:
            # Add the full URL path to the profile picture
            profile_url = request.build_absolute_uri(settings.MEDIA_URL + profile.profile_picture.name)
            profile_data['profile_picture_url'] = profile_url
            print(f"Profile picture URL: {profile_url}")
        else:
            print("No profile picture found for user")
    except Exception as e:
        print(f"Error retrieving profile picture: {str(e)}")
        traceback.print_exc()
    
    return Response(profile_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the authenticated user's profile data
    """
    user = request.user
    print(f"Updating profile for user: {user.username}")
    
    # Update user data
    if 'first_name' in request.data:
        user.first_name = request.data['first_name']
        print(f"Updated first name to: {user.first_name}")
    if 'last_name' in request.data:
        user.last_name = request.data['last_name']
        print(f"Updated last name to: {user.last_name}")
    
    # Save user data
    user.save()
    
    # Get updated profile data
    profile_data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }
    
    # Add profile picture URL if available
    try:
        profile = UserProfile.objects.get(user=user)
        if profile.profile_picture and profile.profile_picture.name:
            profile_url = request.build_absolute_uri(settings.MEDIA_URL + profile.profile_picture.name)
            profile_data['profile_picture_url'] = profile_url
            print(f"Included profile picture URL: {profile_url}")
    except UserProfile.DoesNotExist:
        print("No profile found for user")
    
    return Response(profile_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """
    Upload or update the user's profile picture
    """
    user = request.user
    print(f"Uploading profile picture for user: {user.username}")
    
    if 'profile_picture' not in request.FILES:
        print("No profile picture file in request")
        return Response(
            {'error': 'No image file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create media directory if it doesn't exist
        media_dir = os.path.join(settings.MEDIA_ROOT, 'profile_pictures')
        os.makedirs(media_dir, exist_ok=True)
        
        # Get or create profile for the user
        profile, created = UserProfile.objects.get_or_create(user=user)
        print(f"Profile {'created' if created else 'retrieved'} for user: {user.username}")
        
        # Delete old picture if exists to save storage space
        if profile.profile_picture and profile.profile_picture.name:
            old_picture_path = profile.profile_picture.path
            print(f"Deleting old profile picture: {old_picture_path}")
            try:
                profile.profile_picture.delete(save=False)
                print("Old profile picture deleted successfully")
            except Exception as e:
                print(f"Error deleting old profile picture: {str(e)}")
        
        # Save new picture
        picture_file = request.FILES['profile_picture']
        print(f"Saving new profile picture: {picture_file.name}, size: {picture_file.size} bytes")
        profile.profile_picture = picture_file
        profile.save()
        print(f"Profile saved. Picture path: {profile.profile_picture.path}")
        
        # Build full URL for the picture
        picture_url = request.build_absolute_uri(settings.MEDIA_URL + profile.profile_picture.name)
        print(f"Profile picture URL: {picture_url}")
        
        return Response({
            'message': 'Profile picture updated successfully',
            'profile_picture_url': picture_url
        })
        
    except Exception as e:
        print(f"Error uploading profile picture: {str(e)}")
        traceback.print_exc()
        return Response(
            {'error': f'Failed to upload profile picture: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )