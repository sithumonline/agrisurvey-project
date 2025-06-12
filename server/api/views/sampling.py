from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from api.models import SoilSample, WaterSample
from api.serializers import SoilSampleSerializer, WaterSampleSerializer


class SoilSampleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing soil samples"""

    queryset = SoilSample.objects.all()
    serializer_class = SoilSampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Support file uploads
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'sample_date']
    search_fields = ['farm__name', 'notes']
    ordering_fields = ['sample_date', 'pH', 'moisture_pct']
    ordering = ['-sample_date']

    def get_queryset(self):
        """Filter soil samples based on user role and assigned routes"""
        user = self.request.user
        queryset = SoilSample.objects.select_related('farm').all()

        if hasattr(user, 'is_enumerator') and user.is_enumerator:
            # Enumerators can only see soil samples for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        # Filter by farm if specified
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)

        # Additional filters
        min_ph = self.request.query_params.get('min_ph')
        max_ph = self.request.query_params.get('max_ph')

        if min_ph is not None:
            try:
                queryset = queryset.filter(pH__gte=float(min_ph))
            except ValueError:
                pass

        if max_ph is not None:
            try:
                queryset = queryset.filter(pH__lte=float(max_ph))
            except ValueError:
                pass

        return queryset

    def perform_create(self, serializer):
        """Save the soil sample with the current user"""
        serializer.save()

    def create(self, request, *args, **kwargs):
        """Override create to handle file uploads properly"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Override update to handle file uploads properly"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class WaterSampleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing water samples"""

    queryset = WaterSample.objects.all()
    serializer_class = WaterSampleSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Support file uploads
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'sample_date', 'source']
    search_fields = ['farm__name', 'source', 'notes']
    ordering_fields = ['sample_date', 'pH', 'turbidity']
    ordering = ['-sample_date']

    def get_queryset(self):
        """Filter water samples based on user role and assigned routes"""
        user = self.request.user
        queryset = WaterSample.objects.select_related('farm').all()

        if hasattr(user, 'is_enumerator') and user.is_enumerator:
            # Enumerators can only see water samples for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        # Filter by farm if specified
        farm_id = self.request.query_params.get('farm')
        if farm_id:
            queryset = queryset.filter(farm_id=farm_id)

        # Additional filters
        min_ph = self.request.query_params.get('min_ph')
        max_ph = self.request.query_params.get('max_ph')

        if min_ph is not None:
            try:
                queryset = queryset.filter(pH__gte=float(min_ph))
            except ValueError:
                pass

        if max_ph is not None:
            try:
                queryset = queryset.filter(pH__lte=float(max_ph))
            except ValueError:
                pass

        return queryset

    def perform_create(self, serializer):
        """Save the water sample with the current user"""
        serializer.save()

    def create(self, request, *args, **kwargs):
        """Override create to handle file uploads properly"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Override update to handle file uploads properly"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)