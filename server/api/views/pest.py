from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from api.models import PestDiseaseReport
from api.serializers import PestDiseaseReportSerializer


class PestDiseaseReportViewSet(viewsets.ModelViewSet):
    """ViewSet for managing pest and disease reports"""

    queryset = PestDiseaseReport.objects.all()
    serializer_class = PestDiseaseReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['farm', 'report_date', 'category', 'name', 'severity']
    search_fields = ['farm__name', 'name', 'description']
    ordering_fields = ['report_date', 'name', 'severity']
    ordering = ['-report_date']

    def get_queryset(self):
        """Filter pest/disease reports based on user role and assigned routes"""
        user = self.request.user
        queryset = PestDiseaseReport.objects.all()

        if user.is_enumerator:
            # Enumerators can only see reports for farms in their assigned routes
            queryset = queryset.filter(farm__route__assigned_to=user)

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # Filter by severity
        severity = self.request.query_params.get('severity')
        if severity:
            queryset = queryset.filter(severity=severity)

        return queryset

    def perform_create(self, serializer):
        """Save the pest/disease report"""
        serializer.save()