from api.views.auth import UserViewSet
from api.views.route import RouteViewSet
from api.views.farm import FarmViewSet, CropViewSet
from api.views.sampling import SoilSampleViewSet, WaterSampleViewSet
from api.views.pest import PestDiseaseReportViewSet
from api.views.dashboard import DashboardView

__all__ = [
    'UserViewSet',
    'RouteViewSet',
    'FarmViewSet',
    'CropViewSet',
    'SoilSampleViewSet',
    'WaterSampleViewSet',
    'PestDiseaseReportViewSet',
    'DashboardView',
]