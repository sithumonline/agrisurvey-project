import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _


class SoilSample(models.Model):
    """Soil sample data collected from farms"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(
        'Farm',
        on_delete=models.CASCADE,
        related_name='soil_samples'
    )
    sample_date = models.DateField()
    pH = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(14)
        ],
        help_text="pH level (0-14)"
    )
    moisture_pct = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(100)
        ],
        blank=True,
        null=True,
        help_text="Moisture percentage (0-100)"
    )
    nutrient_n = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Nitrogen level"
    )
    nutrient_p = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Phosphorus level"
    )
    nutrient_k = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Potassium level"
    )
    notes = models.TextField(blank=True, null=True)
    photo = models.ImageField(
        upload_to='soil_samples/%Y/%m/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Soil Sample - {self.farm.name} - {self.sample_date}"

    class Meta:
        ordering = ['-sample_date']
        verbose_name = _('Soil Sample')
        verbose_name_plural = _('Soil Samples')


class WaterSample(models.Model):
    """Water sample data collected from farms"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(
        'Farm',
        on_delete=models.CASCADE,
        related_name='water_samples'
    )
    sample_date = models.DateField()
    source = models.CharField(
        max_length=255,
        help_text="Water source description (e.g., river, well, irrigation)"
    )
    pH = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(14)
        ],
        help_text="pH level (0-14)"
    )
    turbidity = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        validators=[
            MinValueValidator(0)
        ],
        blank=True,
        null=True,
        help_text="Turbidity level in NTU"
    )
    notes = models.TextField(blank=True, null=True)
    photo = models.ImageField(
        upload_to='water_samples/%Y/%m/',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Water Sample - {self.farm.name} - {self.sample_date}"

    class Meta:
        ordering = ['-sample_date']
        verbose_name = _('Water Sample')
        verbose_name_plural = _('Water Samples')