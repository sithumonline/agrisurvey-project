import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _


class Farm(models.Model):
    """Farm model representing agricultural land surveyed"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route = models.ForeignKey(
        'Route',
        on_delete=models.CASCADE,
        related_name='farms'
    )
    name = models.CharField(max_length=255)
    owner_name = models.CharField(max_length=255)
    size_ha = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Size in hectares"
    )
    location = models.TextField(blank=True, null=True,
                                help_text="Location description")
    boundary_geo = models.JSONField(
        blank=True,
        null=True,
        help_text="GeoJSON polygon representing farm boundary"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.owner_name}"

    class Meta:
        ordering = ['-created_at']


class Crop(models.Model):
    """Crop data related to a farm"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(
        Farm,
        on_delete=models.CASCADE,
        related_name='crops'
    )
    crop_type = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True, null=True)
    planting_date = models.DateField()
    expected_harvest = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.crop_type} - {self.farm.name}"

    class Meta:
        ordering = ['-planting_date']