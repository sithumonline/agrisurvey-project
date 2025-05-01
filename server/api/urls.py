from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from api.views import (
    UserViewSet,
    RouteViewSet,
    FarmViewSet,
    CropViewSet,
    SoilSampleViewSet,
    WaterSampleViewSet,
    PestDiseaseReportViewSet,
    DashboardView,
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'farms', FarmViewSet)
router.register(r'crops', CropViewSet)
router.register(r'soil-samples', SoilSampleViewSet)
router.register(r'water-samples', WaterSampleViewSet)
router.register(r'pest-disease', PestDiseaseReportViewSet)

# API URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),

    # Authentication endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Dashboard endpoint
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # Export endpoints (for reports)
    path('export/farms/', FarmViewSet.as_view({'get': 'list'}), name='export_farms', kwargs={'format': 'csv'}),
    path('export/soil-samples/', SoilSampleViewSet.as_view({'get': 'list'}), name='export_soil_samples',
         kwargs={'format': 'csv'}),
    path('export/water-samples/', WaterSampleViewSet.as_view({'get': 'list'}), name='export_water_samples',
         kwargs={'format': 'csv'}),
    path('export/pest-disease/', PestDiseaseReportViewSet.as_view({'get': 'list'}), name='export_pest_disease',
         kwargs={'format': 'csv'}),
]