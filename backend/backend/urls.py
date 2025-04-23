from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from mastodonhub import views as mastodonhub_views
from mastodonhub.views import BlogListCreateView, ClubsViewSet, ClubMembersView
from rest_framework_simplejwt import views as jwt_views
from authentification import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

# Define the router for mastodonhub endpoints
router_mastodon = routers.DefaultRouter()
router_mastodon.register(r'dashboard', mastodonhub_views.DashboardView, basename='dashboard')
router_mastodon.register(r'clubs', mastodonhub_views.ClubsViewSet, basename='clubs')
router_mastodon.register(r'events', mastodonhub_views.EventsViewSet, basename='events')

# Define urlpatterns
urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # Mastodonhub API endpoints
    path('api/mastodonhub/', include(router_mastodon.urls)),
    
    # Blogs endpoint
    path('api/mastodonhub/blogs/', BlogListCreateView.as_view()),
    
    # JWT Token endpoints
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    
    # Authentication URLs
    path('', include('authentification.urls')),
    
    # Custom endpoint for club members
    path('api/mastodonhub/clubs/<int:club_id>/members/', ClubMembersView.as_view(), name='club_members'),
    
    # Profile management endpoints (in mastodonhub app)
    path('profile/', mastodonhub_views.get_profile, name='get_profile'),
    path('profile/update/', mastodonhub_views.update_profile, name='update_profile'),
    path('profile/picture/', mastodonhub_views.upload_profile_picture, name='upload_profile_picture'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)