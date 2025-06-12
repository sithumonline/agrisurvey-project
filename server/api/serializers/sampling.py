from rest_framework import serializers
from api.models import SoilSample, WaterSample, Farm
from django.core.validators import MinValueValidator, MaxValueValidator


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

    def validate_pH(self, value):
        """Validate pH is between 0 and 14"""
        if value < 0 or value > 14:
            raise serializers.ValidationError("pH must be between 0 and 14")
        return value

    def validate_moisture_pct(self, value):
        """Validate moisture percentage is between 0 and 100"""
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("Moisture percentage must be between 0 and 100")
        return value

    def validate_farm(self, value):
        """Ensure the farm belongs to a route assigned to the current user if they're an enumerator"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if hasattr(user, 'is_enumerator') and user.is_enumerator and value.route.assigned_to != user:
                raise serializers.ValidationError("You can only add soil samples to farms in your assigned routes.")
        return value

    def validate_sample_date(self, value):
        """Ensure sample date is not in the future"""
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("Sample date cannot be in the future")
        return value

    def validate_nutrient_n(self, value):
        """Validate nitrogen level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Nitrogen level must be between 0 and 999")
        return value

    def validate_nutrient_p(self, value):
        """Validate phosphorus level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Phosphorus level must be between 0 and 999")
        return value

    def validate_nutrient_k(self, value):
        """Validate potassium level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Potassium level must be between 0 and 999")
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

    def validate_pH(self, value):
        """Validate pH is between 0 and 14"""
        if value < 0 or value > 14:
            raise serializers.ValidationError("pH must be between 0 and 14")
        return value

    def validate_farm(self, value):
        """Ensure the farm belongs to a route assigned to the current user if they're an enumerator"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if hasattr(user, 'is_enumerator') and user.is_enumerator and value.route.assigned_to != user:
                raise serializers.ValidationError("You can only add water samples to farms in your assigned routes.")
        return value

    def validate_sample_date(self, value):
        """Ensure sample date is not in the future"""
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("Sample date cannot be in the future")
        return value

    def validate_nutrient_n(self, value):
        """Validate nitrogen level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Nitrogen level must be between 0 and 999")
        return value

    def validate_nutrient_p(self, value):
        """Validate phosphorus level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Phosphorus level must be between 0 and 999")
        return value

    def validate_nutrient_k(self, value):
        """Validate potassium level is within reasonable range"""
        if value is not None and (value < 0 or value > 999):
            raise serializers.ValidationError("Potassium level must be between 0 and 999")
        return value