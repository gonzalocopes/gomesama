from rest_framework import viewsets
from rest_framework.response import Response
from .models import Producto, Pedido
from .serializers import ProductoSerializer, PedidoSerializer
import json

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        producto = self.get_object()
        serializer = self.get_serializer(producto, context={'request': request})
        return Response(serializer.data)

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        pedido = serializer.save()

        if pedido.completado:
            try:
                productos_pedido = json.loads(pedido.productos)
                for prod in productos_pedido:
                    try:
                        producto = Producto.objects.get(id=prod["id"])
                        if producto.stock >= prod["cantidad"]:
                            producto.stock -= prod["cantidad"]
                            producto.save()
                    except Producto.DoesNotExist:
                        pass
            except Exception as e:
                print("Error procesando productos del pedido:", e)
