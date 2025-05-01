from rest_framework import serializers
from api.models import SoilSample, WaterSample, Farm


class SoilSampleSerializer(serializers.ModelSerializer):
    """Serializer for SoilSample model"""

    farm_name = serializers.SerializerMethodField()

    class Meta:
        model = SoilSample
        fields = [
            'id', 'farm', 'farm_name', 'sample_date', 'pH',
            'moisture_pct', 'nutrient_n', 'nutrient_p', 'nutrient_k',
            'notes', 'photo', 'created_at', 'updated_at'
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
                raise serializers.ValidationError("You can only add soil samples to farms in your assigned routes.")
        return value


class WaterSampleSerializer(serializers.ModelSerializer):
    """Serializer for WaterSample model"""

    farm_name = serializers.SerializerMethodField()

    class Meta:
        model = WaterSample
        fields = [
            'id', 'farm', 'farm_name', 'sample_date', 'source',
            'pH', 'turbidity', 'notes', 'photo',
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
                raise serializers.ValidationError("You can only add water samples to farms in your assigned routes.")
        return value