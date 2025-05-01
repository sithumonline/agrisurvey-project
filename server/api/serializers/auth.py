from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import Route

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model"""

    password = serializers.CharField(write_only=True, required=False)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_display', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class RouteSerializer(serializers.ModelSerializer):
    """Serializer for Route model"""

    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    farm_count = serializers.SerializerMethodField()
    completed_farms = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = [
            'id', 'name', 'assigned_to', 'assigned_to_name', 'date_assigned',
            'status', 'status_display', 'farm_count', 'completed_farms', 'progress'
        ]

    def get_assigned_to_name(self, obj):
        return obj.assigned_to.get_full_name() or obj.assigned_to.username

    def get_farm_count(self, obj):
        return obj.farms.count()

    def get_completed_farms(self, obj):
        # This is a placeholder. In a real app, you would define what makes a farm "completed"
        # For example, having all required samples or meeting certain criteria
        return 0  # Replace with actual logic

    def get_progress(self, obj):
        farm_count = self.get_farm_count(obj)
        if farm_count == 0:
            return 0

        completed = self.get_completed_farms(obj)
        return int((completed / farm_count) * 100)