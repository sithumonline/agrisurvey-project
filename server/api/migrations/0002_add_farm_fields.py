# Django migration for adding address, GPS coordinates, and photo to Farm model
# 
# To apply this migration:
# 1. Copy this file to your api/migrations/ directory
# 2. Rename it to the next migration number (e.g., 0002_add_farm_fields.py)
# 3. Run: python manage.py migrate

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),  # Update this to your last migration
    ]

    operations = [
    #     migrations.AddField(
    #         model_name='farm',
    #         name='address',
    #         field=models.CharField(
    #             max_length=500,
    #             help_text='Physical address of the farm',
    #             default='',  # Temporary default for existing records
    #         ),
    #         preserve_default=False,
    #     ),
    #     migrations.AddField(
    #         model_name='farm',
    #         name='latitude',
    #         field=models.DecimalField(
    #             max_digits=10,
    #             decimal_places=7,
    #             blank=True,
    #             null=True,
    #             help_text='GPS latitude coordinate'
    #         ),
    #     ),
    #     migrations.AddField(
    #         model_name='farm',
    #         name='longitude',
    #         field=models.DecimalField(
    #             max_digits=10,
    #             decimal_places=7,
    #             blank=True,
    #             null=True,
    #             help_text='GPS longitude coordinate'
    #         ),
    #     ),
    #     migrations.AddField(
    #         model_name='farm',
    #         name='photo',
    #         field=models.ImageField(
    #             upload_to='farms/photos/',
    #             blank=True,
    #             null=True,
    #             help_text='Photo of the farm'
    #         ),
    #     ),
    #     migrations.AlterField(
    #         model_name='farm',
    #         name='location',
    #         field=models.TextField(
    #             blank=True,
    #             null=True,
    #             help_text='Additional location description'
    #         ),
    #     ),
    ] 