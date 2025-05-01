from rest_framework import serializers
from api.models import Farm, Crop, Route


class CropSerializer(serializers.ModelSerializer):
    """Serializer for the Crop model"""

    class Meta:
        model = Crop
        fields = [
            'id', 'farm', 'crop_type', 'variety',
            'planting_date', 'expected_harvest',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class FarmSerializer(serializers.ModelSerializer):
    """Serializer for the Farm model"""

    crops = CropSerializer(many=True, read_only=True)
    route_name = serializers.SerializerMethodField()
    soil_sample_count = serializers.SerializerMethodField()
    water_sample_count = serializers.SerializerMethodField()
    pest_disease_count = serializers.SerializerMethodField()

    class Meta:
        model = Farm
        fields = [
            'id', 'route', 'route_name', 'name', 'owner_name',
            'size_ha', 'location', 'boundary_geo',
            'crops', 'soil_sample_count', 'water_sample_count',
            'pest_disease_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_route_name(self, obj):
        return obj.route.name

    def get_soil_sample_count(self, obj):
        return obj.soil_samples.count()

    def get_water_sample_count(self, obj):
        return obj.water_samples.count()

    def get_pest_disease_count(self, obj):
        return obj.pest_disease_reports.count()


class FarmDetailSerializer(FarmSerializer):
    """Serializer for detailed Farm model view"""

    crops = CropSerializer(many=True, read_only=True)

    class Meta(FarmSerializer.Meta):
        pass


class FarmCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating farms"""

    class Meta:
        model = Farm
        fields = [
            'id', 'route', 'name', 'owner_name',
            'size_ha', 'location', 'boundary_geo'
        ]

    def validate_route(self, value):
        """Ensure the route belongs to the current user if they're an enumerator"""
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user.is_enumerator and value.assigned_to != user:
                raise serializers.ValidationError("You can only create farms for your assigned routes.")
        return value