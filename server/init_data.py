#!/usr/bin/env python
"""
Initialization script for AgriSurvey application
Creates superuser and sample data
"""
import os
import django
import datetime
import uuid
import json

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrisurvey.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import (
    UserProfile, Route, Farm, Crop,
    SoilSample, WaterSample, PestDiseaseReport
)


def create_superuser():
    """Create superuser"""
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        # Superuser profile should be created automatically via signal
        admin.profile.role = 'admin'
        admin.profile.save()
        print('Superuser created')
    else:
        print('Superuser already exists')


def create_sample_users():
    """Create sample users"""
    # Create admin user
    if not User.objects.filter(username='manager').exists():
        manager = User.objects.create_user(
            username='manager',
            email='manager@example.com',
            password='manager123',
            first_name='Manager',
            last_name='User'
        )
        manager.profile.role = 'admin'
        manager.profile.save()
        print('Admin user created')

    # Create enumerator users
    enumerators = [
        {'username': 'enum1', 'email': 'enum1@example.com', 'first': 'Alice', 'last': 'Smith'},
        {'username': 'enum2', 'email': 'enum2@example.com', 'first': 'Bob', 'last': 'Johnson'},
        {'username': 'enum3', 'email': 'enum3@example.com', 'first': 'Carol', 'last': 'Williams'}
    ]

    for enum in enumerators:
        if not User.objects.filter(username=enum['username']).exists():
            user = User.objects.create_user(
                username=enum['username'],
                email=enum['email'],
                password='password123',
                first_name=enum['first'],
                last_name=enum['last']
            )
            # Enumerator profile should be created automatically via signal
            print(f'Enumerator {enum["username"]} created')


def create_sample_routes():
    """Create sample routes"""
    # Get enumerator users
    enumerators = User.objects.filter(profile__role='enumerator')

    # Create one route for each enumerator
    for i, enumerator in enumerate(enumerators):
        route = Route.objects.create(
            assigned_to=enumerator,
            date_assigned=datetime.date.today(),
            status=['pending', 'in_progress', 'complete'][i % 3]
        )
        print(f'Created route for {enumerator.username}')

        # Create 2 farms for each route
        for j in range(2):
            farm = Farm.objects.create(
                route=route,
                owner_name=f'Farmer {i * 2 + j + 1}',
                size_ha=5.0 + j * 2.5,
                boundary_geo=json.dumps({
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [30.0 + i * 0.1, 0.0 + j * 0.1],
                            [30.0 + i * 0.1, 1.0 + j * 0.1],
                            [31.0 + i * 0.1, 1.0 + j * 0.1],
                            [31.0 + i * 0.1, 0.0 + j * 0.1],
                            [30.0 + i * 0.1, 0.0 + j * 0.1]
                        ]
                    ]
                })
            )
            print(f'Created farm {farm.owner_name} for route {route.id}')

            # Create crop for each farm
            crop = Crop.objects.create(
                farm=farm,
                crop_type=['Maize', 'Wheat', 'Rice', 'Coffee', 'Tea'][i % 5],
                variety=f'Variety {j + 1}',
                planting_date=datetime.date.today() - datetime.timedelta(days=30),
                expected_harvest=datetime.date.today() + datetime.timedelta(days=90)
            )
            print(f'Created crop {crop.crop_type} for farm {farm.owner_name}')

            # Create soil sample for each farm
            soil_sample = SoilSample.objects.create(
                farm=farm,
                sample_date=datetime.date.today() - datetime.timedelta(days=10),
                pH=6.5 + (i * 0.1),
                moisture_pct=35.0 + (j * 5.0),
                nutrients_n=20 + i + j,
                nutrients_p=15 + i,
                nutrients_k=10 + j
            )
            print(f'Created soil sample for farm {farm.owner_name}')

            # Create water sample for some farms
            if j % 2 == 0:
                water_sample = WaterSample.objects.create(
                    farm=farm,
                    sample_date=datetime.date.today() - datetime.timedelta(days=10),
                    pH=7.0 + (i * 0.2),
                    turbidity=2.5 + (j * 0.5)
                )
                print(f'Created water sample for farm {farm.owner_name}')

            # Create pest/disease report for some farms
            if i % 2 == 0:
                pest_report = PestDiseaseReport.objects.create(
                    farm=farm,
                    report_date=datetime.date.today() - datetime.timedelta(days=5),
                    category='pest' if j % 2 == 0 else 'disease',
                    name=['Fall Armyworm', 'Maize Stalk Borer', 'Leaf Rust', 'Blast', 'Blight'][i % 5],
                    severity=['low', 'medium', 'high'][j % 3],
                    description=f'Observed in the {["north", "south", "east", "west"][i % 4]} section of the farm.',
                    location_lat=30.05 + i * 0.1,
                    location_lng=0.05 + j * 0.1
                )
                print(f'Created {"pest" if j % 2 == 0 else "disease"} report for farm {farm.owner_name}')


def main():
    """Main function"""
    print('Starting data initialization...')
    create_superuser()
    create_sample_users()
    create_sample_routes()
    print('Data initialization completed')


if __name__ == '__main__':
    main()