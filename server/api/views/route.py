from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Route
from api.serializers import RouteSerializer



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