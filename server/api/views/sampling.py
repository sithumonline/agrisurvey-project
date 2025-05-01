from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from api.models import SoilSample, WaterSample
from api.serializers import SoilSampleSerializer, WaterSampleSerializer


class SoilSampleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing soil samples"""

    queryset = SoilSample.objects.all()
    serializer_class = SoilSampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'sample_date']
    search_fields = ['farm__name', 'notes']
    ordering_fields = ['sample_date', 'pH', 'moisture_pct']
    ordering = ['-sample_date']

    def get_queryset(self):
        """Filter soil samples based on user role and assigned routes"""
        user = self.request.user
        queryset = SoilSample.objects.all()

        if user.is_enumerator:
            # Enumerators can only see soil samples for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        # Additional filters
        min_ph = self.request.query_params.get('min_ph')
        max_ph = self.request.query_params.get('max_ph')

        if min_ph is not None:
            queryset = queryset.filter(pH__gte=min_ph)

        if max_ph is not None:
            queryset = queryset.filter(pH__lte=max_ph)

        return queryset

    def perform_create(self, serializer):
        """Save the soil sample with the current user"""
        serializer.save()


class WaterSampleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing water samples"""

    queryset = WaterSample.objects.all()
    serializer_class = WaterSampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'sample_date', 'source']
    search_fields = ['farm__name', 'source', 'notes']
    ordering_fields = ['sample_date', 'pH', 'turbidity']
    ordering = ['-sample_date']

    def get_queryset(self):
        """Filter water samples based on user role and assigned routes"""
        user = self.request.user
        queryset = WaterSample.objects.all()

        if user.is_enumerator:
            # Enumerators can only see water samples for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        # Additional filters
        min_ph = self.request.query_params.get('min_ph')
        max_ph = self.request.query_params.get('max_ph')

        if min_ph is not None:
            queryset = queryset.filter(pH__gte=min_ph)

        if max_ph is not None:
            queryset = queryset.filter(pH__lte=max_ph)

        return queryset

    def perform_create(self, serializer):
        """Save the water sample with the current user"""
        serializer.save()