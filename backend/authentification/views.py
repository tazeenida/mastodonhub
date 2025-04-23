from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from .serializers import ChangePasswordSerializer, SecurityQuestionSerializer
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

# Logout View
class LogoutView(APIView):
    def post(self, request):
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

# SignUp View
class SignUpView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already used.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=username, email=email, password=make_password(password))
        user.save()
        return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)

# Get User Details
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_user_details(request):
    user = request.user
    if request.method == 'GET':
        return Response({
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
        })
    elif request.method == 'PUT':
        # Handle profile updates here
        return Response({'message': 'Profile updated successfully.'}, status=status.HTTP_200_OK)

# Password Reset Views
class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = request.build_absolute_uri(
                reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            )
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_url}',
                'from@example.com',
                [user.email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if default_token_generator.check_token(user, token):
                new_password = request.data.get('new_password')
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid user.'}, status=status.HTTP_400_BAD_REQUEST)

# Change Password View
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not check_password(serializer.validated_data['current_password'], user.password):
                return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Security Question View
class SecurityQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = SecurityQuestionSerializer(data=request.data)
        if serializer.is_valid():
            user.security_question = serializer.validated_data['security_question']
            user.security_answer = make_password(serializer.validated_data['security_answer'])
            user.save()
            return Response({'message': 'Security question updated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Check Admin Status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_status(request):
    user = request.user
    is_admin = user.is_staff or user.is_superuser
    return Response({
        'is_admin': is_admin,
        'username': user.username
    }, status=status.HTTP_200_OK)