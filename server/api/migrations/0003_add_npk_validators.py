# Generated manually
from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_add_farm_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='soilsample',
            name='nutrient_n',
            field=models.DecimalField(
                blank=True, 
                decimal_places=2, 
                help_text='Nitrogen level (0-999)', 
                max_digits=6, 
                null=True, 
                validators=[
                    django.core.validators.MinValueValidator(0), 
                    django.core.validators.MaxValueValidator(999)
                ]
            ),
        ),
        migrations.AlterField(
            model_name='soilsample',
            name='nutrient_p',
            field=models.DecimalField(
                blank=True, 
                decimal_places=2, 
                help_text='Phosphorus level (0-999)', 
                max_digits=6, 
                null=True, 
                validators=[
                    django.core.validators.MinValueValidator(0), 
                    django.core.validators.MaxValueValidator(999)
                ]
            ),
        ),
        migrations.AlterField(
            model_name='soilsample',
            name='nutrient_k',
            field=models.DecimalField(
                blank=True, 
                decimal_places=2, 
                help_text='Potassium level (0-999)', 
                max_digits=6, 
                null=True, 
                validators=[
                    django.core.validators.MinValueValidator(0), 
                    django.core.validators.MaxValueValidator(999)
                ]
            ),
        ),
    ] 