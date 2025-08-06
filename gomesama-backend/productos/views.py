from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Producto, Pedido
from .serializers import ProductoSerializer, PedidoSerializer
import json

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

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