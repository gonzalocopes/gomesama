from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from productos.views import ProductoViewSet, PedidoViewSet

router = routers.DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

# Servir archivos MEDIA incluso en producción
urlpatterns += static('/media/', document_root=settings.MEDIA_ROOT)
