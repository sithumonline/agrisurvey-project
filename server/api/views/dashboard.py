from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from api.models import (
    Route, Farm,
    SoilSample, WaterSample,
    PestDiseaseReport
)


class DashboardView(APIView):
    """
    Dashboard API endpoint
    Returns summary statistics based on user role
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        is_admin = user.role == 'admin'

        # Base dashboard data
        dashboard_data = {
            'user': {
                'id': str(user.id),
                'username': user.username,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'role': user.role,
                'email': user.email,
            },
        }

        # Routes statistics
        if is_admin:
            # Admin sees all routes
            routes = Route.objects.all()
        else:
            # Enumerator sees only assigned routes
            routes = Route.objects.filter(assigned_to=user)
        
        route_stats = routes.aggregate(
            total=Count('id'),
            completed=Count('id', filter=Q(status='completed')),
            in_progress=Count('id', filter=Q(status='in_progress')),
            pending=Count('id', filter=Q(status='pending'))
        )
        dashboard_data['routes'] = route_stats

        # Farms statistics
        if is_admin:
            farms = Farm.objects.all()
        else:
            # Enumerator sees farms in their routes
            farms = Farm.objects.filter(route__assigned_to=user)
        
        dashboard_data['farms'] = {
            'total': farms.count(),
            'recent': farms.filter(
                created_at__gte=timezone.now() - timedelta(days=7)
            ).count()
        }

        # Sampling statistics
        if is_admin:
            soil_samples = SoilSample.objects.all()
            water_samples = WaterSample.objects.all()
        else:
            soil_samples = SoilSample.objects.filter(farm__route__assigned_to=user)
            water_samples = WaterSample.objects.filter(farm__route__assigned_to=user)

        dashboard_data['sampling'] = {
            'soil': {
                'total': soil_samples.count(),
                'recent': soil_samples.filter(
                    created_at__gte=timezone.now() - timedelta(days=7)
                ).count()
            },
            'water': {
                'total': water_samples.count(),
                'recent': water_samples.filter(
                    created_at__gte=timezone.now() - timedelta(days=7)
                ).count()
            }
        }

        # Pest & Disease reports
        if is_admin:
            pest_reports = PestDiseaseReport.objects.all()
        else:
            pest_reports = PestDiseaseReport.objects.filter(farm__route__assigned_to=user)
        
        dashboard_data['pest_reports'] = {
            'total': pest_reports.count(),
            'high_severity': pest_reports.filter(severity='high').count(),
            'recent': pest_reports.filter(
                created_at__gte=timezone.now() - timedelta(days=7)
            ).count()
        }

        # Recent activity
        recent_farms = farms.order_by('-created_at')[:5]
        recent_samples = []
        
        for sample in soil_samples.order_by('-created_at')[:3]:
            recent_samples.append({
                'type': 'soil',
                'farm': sample.farm.name,
                'date': sample.created_at,
                'id': str(sample.id)
            })

        for sample in water_samples.order_by('-created_at')[:3]:
            recent_samples.append({
                'type': 'water',
                'farm': sample.farm.name,
                'date': sample.created_at,
                'id': str(sample.id)
            })

        # Sort by date
        recent_samples.sort(key=lambda x: x['date'], reverse=True)
        
        dashboard_data['activity'] = [
            {
                'type': 'farm',
                'name': farm.name,
                'date': farm.created_at,
                'id': str(farm.id)
            } for farm in recent_farms
        ] + recent_samples[:5]  # Limit to 5 most recent

        # Admin-specific data
        if is_admin:
            # Overall completion stats
            total_routes = Route.objects.count()
            completed_routes = Route.objects.filter(status='completed').count()
            
            dashboard_data['admin_stats'] = {
                'total_users': user.__class__.objects.count(),
                'total_enumerators': user.__class__.objects.filter(role='enumerator').count(),
                'overall_completion': round(completed_routes / total_routes * 100) if total_routes > 0 else 0,
                'farms_with_samples': farms.filter(
                    Q(soil_samples__isnull=False) | Q(water_samples__isnull=False)
                ).distinct().count()
            }

        return Response(dashboard_data)

    def _get_farms_by_route(self, farms):
        """Get farm counts by route"""
        result = {}

        route_counts = farms.values('route__name', 'route__id').annotate(
            count=Count('id')
        ).order_by('route__name')

        for item in route_counts:
            route_id = str(item['route__id'])
            result[route_id] = {
                'name': item['route__name'],
                'count': item['count']
            }

        return result

    def _get_latest_samples(self, samples, limit=5):
        """Get the latest samples"""
        latest = []

        for sample in samples.order_by('-sample_date')[:limit]:
            latest.append({
                'id': str(sample.id),
                'farm_name': sample.farm.name,
                'date': sample.sample_date.isoformat(),
                'ph': float(sample.pH) if sample.pH else None,
            })

        return latest

    def _get_latest_pest_disease(self, reports, limit=5):
        """Get the latest pest/disease reports"""
        latest = []

        for report in reports.order_by('-report_date')[:limit]:
            latest.append({
                'id': str(report.id),
                'farm_name': report.farm.name,
                'date': report.report_date.isoformat(),
                'name': report.name,
                'category': report.category,
                'severity': report.severity,
            })

        return latest