from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API schema configuration
schema_view = get_schema_view(
    openapi.Info(
        title="AgriSurvey API",
        default_version='v1',
        description="API for AgriSurvey agricultural field data collection application",
        contact=openapi.Contact(email="contact@agrisurvey.example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # API URLs
    # API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)