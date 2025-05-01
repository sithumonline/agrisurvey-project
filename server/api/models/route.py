import uuid
from django.utils.translation import gettext_lazy as _

from django.db import models

from api.models import User


class Route(models.Model):
    """Survey routes assigned to enumerators"""

    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending')
        IN_PROGRESS = 'in_progress', _('In Progress')
        COMPLETE = 'complete', _('Complete')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='routes',
        #limit_choices_to={'role': User.Role.ENUMERATOR}
    )
    date_assigned = models.DateField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    def __str__(self):
        return f"{self.name} - {self.get_status_display()}"

    class Meta:
        ordering = ['-date_assigned']