from rest_framework import serializers
from django.db.models import Count, Q

from api.models import Route, User


class RouteSerializer(serializers.ModelSerializer):
    """Serializer for Route model"""

    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    farm_count = serializers.SerializerMethodField()
    completed_farms = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    #assigned_to = serializers.PrimaryKeyRelatedField(
    #    queryset=User.objects.filter(role=User.Role.ENUMERATOR),
    #)
    class Meta:
        model = Route
        fields = [
            'id', 'name', 'assigned_to', 'assigned_to_name', 'date_assigned',
            'status', 'status_display', 'farm_count', 'completed_farms', 'progress'
        ]

    def get_assigned_to_name(self, obj):
        # debug
        #print(obj.assigned_to.get_full_name(), obj.assigned_to.username)
        return obj.assigned_to.get_full_name() or obj.assigned_to.username


    def get_farm_count(self, obj):
        return obj.farms.count()

    def get_completed_farms(self, obj):
        """Count farms that have samples or pest reports"""
        # Use annotate to count farms with samples or pest reports in a single query
        completed_farms = obj.farms.annotate(
            sample_count=Count('soil_samples') + Count('water_samples'),
            pest_count=Count('pest_disease_reports')
        ).filter(
            Q(sample_count__gt=0) | Q(pest_count__gt=0)
        ).count()
        
        return completed_farms

    def get_progress(self, obj):
        farm_count = self.get_farm_count(obj)
        if farm_count == 0:
            return 0

        completed = self.get_completed_farms(obj)
        return int((completed / farm_count) * 100)