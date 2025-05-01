from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from api.models import Farm, Crop
from api.serializers import (
    FarmSerializer, FarmDetailSerializer, FarmCreateUpdateSerializer,
    CropSerializer
)


class FarmViewSet(viewsets.ModelViewSet):
    """ViewSet for managing farms"""

    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['route', 'name', 'owner_name']
    search_fields = ['name', 'owner_name', 'location']
    ordering_fields = ['name', 'owner_name', 'size_ha', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter farms based on user role and assigned routes"""
        user = self.request.user
        queryset = Farm.objects.all()

        if user.is_enumerator:
            # Enumerators can only see farms in their assigned routes
            queryset = queryset.filter(route__assigned_to=user)

        return queryset

    def get_serializer_class(self):
        """Return different serializers for different actions"""
        if self.action == 'retrieve':
            return FarmDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return FarmCreateUpdateSerializer
        return FarmSerializer

    @action(detail=True, methods=['get'])
    def samples(self, request, pk=None):
        """Get all samples (soil and water) for a farm"""
        farm = self.get_object()

        # Get soil and water samples
        soil_samples = farm.soil_samples.all()
        water_samples = farm.water_samples.all()

        from api.serializers import SoilSampleSerializer, WaterSampleSerializer

        # Serialize the data
        soil_data = SoilSampleSerializer(soil_samples, many=True).data
        water_data = WaterSampleSerializer(water_samples, many=True).data

        return Response({
            'soil_samples': soil_data,
            'water_samples': water_data
        })

    @action(detail=True, methods=['get'])
    def pest_disease(self, request, pk=None):
        """Get all pest and disease reports for a farm"""
        farm = self.get_object()

        # Get pest and disease reports
        reports = farm.pest_disease_reports.all()

        from api.serializers import PestDiseaseReportSerializer

        # Serialize the data
        data = PestDiseaseReportSerializer(reports, many=True).data

        return Response(data)


class CropViewSet(viewsets.ModelViewSet):
    """ViewSet for managing crops"""

    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'crop_type', 'planting_date']
    search_fields = ['crop_type', 'variety']
    ordering_fields = ['planting_date', 'expected_harvest']
    ordering = ['-planting_date']

    def get_queryset(self):
        """Filter crops based on user role and assigned routes"""
        user = self.request.user
        queryset = Crop.objects.all()

        if user.is_enumerator:
            # Enumerators can only see crops for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        return queryset