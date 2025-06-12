# Generated manually
from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_add_npk_validators'),
    ]

    operations = [
        migrations.AlterField(
            model_name='watersample',
            name='turbidity',
            field=models.DecimalField(
                blank=True, 
                decimal_places=2, 
                help_text='Turbidity level in NTU', 
                max_digits=7, 
                null=True, 
                validators=[
                    django.core.validators.MinValueValidator(0)
                ]
            ),
        ),
    ] 