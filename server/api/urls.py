from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from api.views.auth import UserViewSet
from api.views.route import RouteViewSet
from api.views.farm import FarmViewSet, CropViewSet
from api.views.sampling import SoilSampleViewSet, WaterSampleViewSet
from api.views.pest import PestDiseaseReportViewSet
from api.views.dashboard import DashboardView
from api.views.export import (
    ExportFarmsView,
    ExportSoilSamplesView,
    ExportWaterSamplesView,
    ExportPestDiseaseView
)

# Create a router and register our viewsets with it.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'routes', RouteViewSet, basename='route')
router.register(r'farms', FarmViewSet, basename='farm')
router.register(r'crops', CropViewSet, basename='crop')
router.register(r'soil-samples', SoilSampleViewSet, basename='soilsample')
router.register(r'water-samples', WaterSampleViewSet, basename='watersample')
router.register(r'pest-disease', PestDiseaseReportViewSet, basename='pestdisease')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),

    # Auth endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Dashboard endpoint
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # Export endpoints (admin only)
    path('export/farms/', ExportFarmsView.as_view(), name='export_farms'),
    path('export/soil-samples/', ExportSoilSamplesView.as_view(), name='export_soil_samples'),
    path('export/water-samples/', ExportWaterSamplesView.as_view(), name='export_water_samples'),
    path('export/pest-disease/', ExportPestDiseaseView.as_view(), name='export_pest_disease'),
]

