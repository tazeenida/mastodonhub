from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator

class mastodonhubDashboard(models.Model):
    Title = models.CharField(max_length=120)
    Description = models.TextField()
    ImageUrl = models.URLField()

    def __str__(self):
        return self.Title

class mastodonhubEvents(models.Model):
    Title = models.CharField(max_length=120)
    Description = models.TextField()
    Location = models.CharField(max_length=120)
    Date = models.DateField()
    StartTime = models.TimeField()
    EndTime = models.TimeField()
    ImageUrl = models.URLField()
    Category = models.CharField(max_length=50)

    def __str__(self):
        return self.Title

class mastodonhubClubs(models.Model):
    Title = models.CharField(max_length=120)
    PresidentName = models.TextField()
    TreasurerName = models.TextField()
    AdvisorName = models.TextField()
    Email = models.TextField()
    ImageUrl = models.URLField()
    Category = models.CharField(max_length=50)
    Description = models.TextField(blank=True, null=True)  # New field

    def __str__(self):
        return self.Title

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    event = models.ForeignKey('mastodonhubEvents', on_delete=models.CASCADE)  # ForeignKey to mastodonhubEvents
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

# Signal to create/update UserProfile when User is created/updated
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()