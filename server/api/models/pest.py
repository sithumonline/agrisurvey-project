import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _


class PestDiseaseReport(models.Model):
    """Pest and disease reports for farms"""

    class Category(models.TextChoices):
        PEST = 'pest', _('Pest')
        DISEASE = 'disease', _('Disease')

    class Severity(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farm = models.ForeignKey(
        'Farm',
        on_delete=models.CASCADE,
        related_name='pest_disease_reports'
    )
    report_date = models.DateField()
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.PEST
    )
    name = models.CharField(
        max_length=255,
        help_text="Name of the pest or disease"
    )
    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.MEDIUM
    )
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(
        upload_to='pest_disease/%Y/%m/',
        blank=True,
        null=True
    )
    location_lat = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text="GPS latitude"
    )
    location_lng = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True,
        help_text="GPS longitude"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_category_display()} - {self.name} - {self.farm.name}"

    class Meta:
        ordering = ['-report_date']
        verbose_name = _('Pest/Disease Report')
        verbose_name_plural = _('Pest/Disease Reports')