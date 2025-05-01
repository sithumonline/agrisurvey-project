from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

from api.models import (
    User, Route,
    Farm, Crop,
    SoilSample, WaterSample,
    PestDiseaseReport
)

# User admin customization
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('AgriSurvey info'), {'fields': ('role',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role'),
        }),
    )
    search_fields = ('username', 'first_name', 'last_name', 'email')

admin.site.register(User, CustomUserAdmin)

# Route admin
@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('name', 'assigned_to', 'status', 'date_assigned')
    list_filter = ('status', 'date_assigned')
    search_fields = ('name', 'assigned_to__username')
    date_hierarchy = 'date_assigned'

# Farm admin
@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_name', 'route', 'size_ha', 'created_at')
    list_filter = ('route', 'created_at')
    search_fields = ('name', 'owner_name', 'location')
    date_hierarchy = 'created_at'

# Crop admin
@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('crop_type', 'variety', 'farm', 'planting_date', 'expected_harvest')
    list_filter = ('crop_type', 'planting_date')
    search_fields = ('crop_type', 'variety', 'farm__name')
    date_hierarchy = 'planting_date'

# Soil Sample admin
@admin.register(SoilSample)
class SoilSampleAdmin(admin.ModelAdmin):
    list_display = ('id', 'farm', 'sample_date', 'pH', 'moisture_pct')
    list_filter = ('sample_date',)
    search_fields = ('farm__name', 'notes')
    date_hierarchy = 'sample_date'

# Water Sample admin
@admin.register(WaterSample)
class WaterSampleAdmin(admin.ModelAdmin):
    list_display = ('id', 'farm', 'source', 'sample_date', 'pH', 'turbidity')
    list_filter = ('sample_date', 'source')
    search_fields = ('farm__name', 'source', 'notes')
    date_hierarchy = 'sample_date'

# Pest Disease Report admin
@admin.register(PestDiseaseReport)
class PestDiseaseReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'farm', 'category', 'name', 'severity', 'report_date')
    list_filter = ('category', 'severity', 'report_date')
    search_fields = ('farm__name', 'name', 'description')
    date_hierarchy = 'report_date'