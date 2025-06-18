import csv
from django.http import HttpResponse
from rest_framework import views, permissions
from rest_framework.response import Response
from api.models import Farm, SoilSample, WaterSample, PestDiseaseReport


class IsAdminUser(permissions.BasePermission):
    """
    仅允许管理员访问
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class ExportFarmsView(views.APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        # 创建CSV响应
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="farms.csv"'
        
        writer = csv.writer(response)
        # 写入表头
        writer.writerow([
            'ID', 'Name', 'Owner Name', 'Location', 'Address', 'Size (ha)', 
            'Route', 'Latitude', 'Longitude', 'Created At'
        ])
        
        # 写入数据
        farms = Farm.objects.select_related('route').all()
        for farm in farms:
            writer.writerow([
                farm.id,
                farm.name,
                farm.owner_name,
                farm.location,
                farm.address,
                farm.size_ha,
                farm.route.name if farm.route else '',
                farm.latitude,
                farm.longitude,
                farm.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


class ExportSoilSamplesView(views.APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="soil_samples.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Farm', 'Sample Date', 'pH', 'Moisture %', 
            'Nitrogen', 'Phosphorus', 'Potassium', 'Notes', 'Created At'
        ])
        
        samples = SoilSample.objects.select_related('farm').all()
        for sample in samples:
            writer.writerow([
                sample.id,
                sample.farm.name,
                sample.sample_date.strftime('%Y-%m-%d'),
                sample.pH,
                sample.moisture_pct,
                sample.nitrogen,
                sample.phosphorus,
                sample.potassium,
                sample.notes,
                sample.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


class ExportWaterSamplesView(views.APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="water_samples.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Farm', 'Source', 'Sample Date', 'pH', 
            'Turbidity (NTU)', 'Bacteria Present', 'Notes', 'Created At'
        ])
        
        samples = WaterSample.objects.select_related('farm').all()
        for sample in samples:
            writer.writerow([
                sample.id,
                sample.farm.name,
                sample.source,
                sample.sample_date.strftime('%Y-%m-%d'),
                sample.pH,
                sample.turbidity,
                'Yes' if sample.bacteria_present else 'No',
                sample.notes,
                sample.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response


class ExportPestDiseaseView(views.APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="pest_disease_reports.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'ID', 'Farm', 'Category', 'Name', 'Severity', 
            'Report Date', 'Description', 'Created At'
        ])
        
        reports = PestDiseaseReport.objects.select_related('farm').all()
        for report in reports:
            writer.writerow([
                report.id,
                report.farm.name,
                report.category,
                report.name,
                report.severity,
                report.report_date.strftime('%Y-%m-%d'),
                report.description,
                report.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return response 