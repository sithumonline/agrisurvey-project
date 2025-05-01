from rest_framework import serializers
from api.models import PestDiseaseReport


class PestDiseaseReportSerializer(serializers.ModelSerializer):
    """Serializer for PestDiseaseReport model"""

    farm_name = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)

    class Meta:
        model = PestDiseaseReport
        fields = [
            'id', 'farm', 'farm_name', 'report_date',
            'category', 'category_display', 'name',
            'severity', 'severity_display', 'description',
            'photo', 'location_lat', 'location_lng',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_farm_name(self, obj):
        return obj.farm.name

    def validate_farm(self, value):
        """Ensure the farm belongs to a route assigned to the current user if they're an enumerator"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_enumerator and value.route.assigned_to != user:
                raise serializers.ValidationError(
                    "You can only add pest/disease reports to farms in your assigned routes.")
        return value