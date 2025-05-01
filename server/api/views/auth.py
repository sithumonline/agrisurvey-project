from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from api.models import Route
from api.serializers import UserSerializer, RouteSerializer

User = get_user_model()


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission class allowing only admin users to edit users
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_admin


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for managing users"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        """Filter users based on role"""
        queryset = User.objects.all().order_by('username')

        # Filter by role if provided
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)

        return queryset

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """Register a new user (available only in development)"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            response_data = {
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RouteViewSet(viewsets.ModelViewSet):
    """ViewSet for managing survey routes"""

    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter routes by assigned user if the current user is an enumerator"""
        user = self.request.user
        queryset = Route.objects.all().order_by('-date_assigned')

        if user.is_enumerator:
            queryset = queryset.filter(assigned_to=user)

        # Filter by status if provided
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update the status of a route"""
        route = self.get_object()

        # Check if user has permission (admin or assigned enumerator)
        if not request.user.is_admin and route.assigned_to != request.user:
            return Response(
                {"detail": "You do not have permission to update this route's status."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Update status
        new_status = request.data.get('status')
        if new_status not in dict(Route.Status.choices).keys():
            return Response(
                {"detail": f"Invalid status. Choose from: {', '.join(dict(Route.Status.choices).keys())}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        route.status = new_status
        route.save()

        return Response(self.get_serializer(route).data)