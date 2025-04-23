from rest_framework import viewsets, generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile
from django.http import JsonResponse


from .serializers import (
    DashboardSerializer, 
    ClubsSerializer, 
    EventsSerializer, 
    BlogSerializer,
    UserSerializer,
    UserProfileSerializer
)
from .models import (
    mastodonhubDashboard, 
    mastodonhubEvents, 
    mastodonhubClubs, 
    Blog,
    UserProfile
)

class DashboardView(viewsets.ModelViewSet):
    serializer_class = DashboardSerializer
    queryset = mastodonhubDashboard.objects.all()

class EventsViewSet(viewsets.ModelViewSet):
    serializer_class = EventsSerializer
    queryset = mastodonhubEvents.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        # List and retrieve can be public
        if self.action in ['list', 'retrieve']:
            return []
        # Other actions require authentication
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Only staff/superusers can create/update/delete
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to create events.")
        serializer.save()

    def perform_update(self, serializer):
        # Only staff/superusers can create/update/delete
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update events.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only staff/superusers can create/update/delete
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete events.")
        instance.delete()

class ClubsViewSet(viewsets.ModelViewSet):
    queryset = mastodonhubClubs.objects.all()
    serializer_class = ClubsSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # List and retrieve can be public
        if self.action in ['list', 'retrieve']:
            return []
        # Other actions require authentication
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Only staff/superusers can create clubs
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to create clubs.")
        
        # Add custom logic (e.g., set the club's creator)
        club = serializer.save()
        club.created_by = self.request.user
        club.save()

    def perform_update(self, serializer):
        # Only staff/superusers can create/update/delete
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to update clubs.")
        serializer.save()

    def perform_destroy(self, instance):
        # Only staff/superusers can create/update/delete
        if not self.request.user.is_staff and not self.request.user.is_superuser:
            raise PermissionDenied("You do not have permission to delete clubs.")
        instance.delete()

class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@api_view(['GET'])
def check_admin_status(request):
    """
    Check if the current user is an admin
    """
    # Ensure user is authenticated
    if not request.user.is_authenticated:
        return Response({'is_admin': False}, status=401)
    
    # Check if user is staff or superuser
    is_admin = request.user.is_staff or request.user.is_superuser
    
    return Response({
        'is_admin': is_admin,
        'username': request.user.username
    })

class ClubMembersView(APIView):
    def get(self, request, club_id):
        """
        Retrieve members of a specific club.
        """
        try:
            club = mastodonhubClubs.objects.get(id=club_id)
            # Example: Retrieve members (assuming a related field exists)
            members = club.members.all()  # Adjust this based on your model
            return Response([member.username for member in members], status=status.HTTP_200_OK)
        except mastodonhubClubs.DoesNotExist:
            return Response({"error": "Club not found."}, status=status.HTTP_404_NOT_FOUND)

# Profile Management Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """
    Get the authenticated user's profile data
    """
    user = request.user
    
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
        if profile.profile_picture:
            profile_data['profile_picture_url'] = profile.profile_picture.url
    except Exception as e:
        # Log the error but continue (don't fail because of image issues)
        print(f"Error accessing profile picture: {str(e)}")
    
    return Response(profile_data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the authenticated user's profile data
    """
    user = request.user
    
    # Update user data
    if 'first_name' in request.data:
        user.first_name = request.data['first_name']
    if 'last_name' in request.data:
        user.last_name = request.data['last_name']
    
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
        if profile.profile_picture:
            profile_data['profile_picture_url'] = profile.profile_picture.url
    except UserProfile.DoesNotExist:
        pass
    
    return Response(profile_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_picture(request):
    """
    Upload or update the user's profile picture
    """
    user = request.user
    
    if 'profile_picture' not in request.FILES:
        return Response(
            {'error': 'No image file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get or create profile for the user
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        # Delete old picture if exists to save storage space
        if profile.profile_picture:
            profile.profile_picture.delete(save=False)
            
        # Save new picture
        profile.profile_picture = request.FILES['profile_picture']
        profile.save()
        
        return Response({
            'message': 'Profile picture updated successfully',
            'profile_picture_url': profile.profile_picture.url
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to upload profile picture: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )