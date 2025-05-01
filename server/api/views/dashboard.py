from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Q
from api.models import (
    Route, Farm, Crop,
    SoilSample, WaterSample,
    PestDiseaseReport
)


class DashboardView(APIView):
    """View for dashboard data and statistics"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        """Get dashboard stats based on user role"""
        user = request.user

        # Base dashboard stats
        stats = {
            'user': {
                'id': str(user.id),
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'role': user.role,
            }
        }

        # Filter data by user if enumerator
        route_filter = {}
        farm_filter = {}

        if user.is_enumerator:
            route_filter = {'assigned_to': user}
            farm_filter = {'route__assigned_to': user}

        # Get route stats
        routes = Route.objects.filter(**route_filter)
        route_stats = {
            'total': routes.count(),
            'pending': routes.filter(status=Route.Status.PENDING).count(),
            'in_progress': routes.filter(status=Route.Status.IN_PROGRESS).count(),
            'complete': routes.filter(status=Route.Status.COMPLETE).count(),
        }
        stats['routes'] = route_stats

        # Get farm stats
        farms = Farm.objects.filter(**farm_filter)
        farm_stats = {
            'total': farms.count(),
            'by_route': self._get_farms_by_route(farms),
        }
        stats['farms'] = farm_stats

        # Get sampling stats
        soil_samples = SoilSample.objects.filter(farm__in=farms)
        water_samples = WaterSample.objects.filter(farm__in=farms)

        sampling_stats = {
            'soil': {
                'total': soil_samples.count(),
                'latest': self._get_latest_samples(soil_samples, 5),
            },
            'water': {
                'total': water_samples.count(),
                'latest': self._get_latest_samples(water_samples, 5),
            }
        }
        stats['sampling'] = sampling_stats

        # Get pest & disease stats
        pest_disease = PestDiseaseReport.objects.filter(farm__in=farms)

        pest_disease_stats = {
            'total': pest_disease.count(),
            'by_category': {
                'pest': pest_disease.filter(category=PestDiseaseReport.Category.PEST).count(),
                'disease': pest_disease.filter(category=PestDiseaseReport.Category.DISEASE).count(),
            },
            'by_severity': {
                'low': pest_disease.filter(severity=PestDiseaseReport.Severity.LOW).count(),
                'medium': pest_disease.filter(severity=PestDiseaseReport.Severity.MEDIUM).count(),
                'high': pest_disease.filter(severity=PestDiseaseReport.Severity.HIGH).count(),
            },
            'latest': self._get_latest_pest_disease(pest_disease, 5),
        }
        stats['pest_disease'] = pest_disease_stats

        # Get activity stats (recent entries)
        activity = []

        # Recent farms
        for farm in farms.order_by('-created_at')[:5]:
            activity.append({
                'type': 'farm',
                'id': str(farm.id),
                'name': farm.name,
                'date': farm.created_at.isoformat(),
                'summary': f"Added Farm: {farm.name}"
            })

        # Recent soil samples
        for sample in soil_samples.order_by('-created_at')[:5]:
            activity.append({
                'type': 'soil_sample',
                'id': str(sample.id),
                'farm_name': sample.farm.name,
                'date': sample.created_at.isoformat(),
                'summary': f"Soil Sample: {sample.farm.name}"
            })

        # Recent water samples
        for sample in water_samples.order_by('-created_at')[:5]:
            activity.append({
                'type': 'water_sample',
                'id': str(sample.id),
                'farm_name': sample.farm.name,
                'date': sample.created_at.isoformat(),
                'summary': f"Water Sample: {sample.farm.name}"
            })

        # Recent pest/disease reports
        for report in pest_disease.order_by('-created_at')[:5]:
            activity.append({
                'type': 'pest_disease',
                'id': str(report.id),
                'farm_name': report.farm.name,
                'date': report.created_at.isoformat(),
                'summary': f"{report.get_category_display()} Report: {report.name} on {report.farm.name}"
            })

        # Sort by date
        activity.sort(key=lambda x: x['date'], reverse=True)
        stats['activity'] = activity[:10]  # Only take the 10 most recent

        return Response(stats)

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