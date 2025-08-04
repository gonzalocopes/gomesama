from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Producto, Pedido
from .serializers import ProductoSerializer, PedidoSerializer
import json

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

    def create(self, request, *args, **kwargs):
        """
        Cuando se crea un pedido desde React, se guarda con completado=False.
        El stock NO se descuenta hasta que el admin lo marque como completado.
        """
        return super().create(request, *args, **kwargs)

    def perform_update(self, serializer):
        """
        Cuando el admin actualiza el pedido y lo marca como completado,
        se descuenta el stock de los productos.
        """
        pedido = serializer.save()

        # Si el pedido pasa a completado, descontar stock
        if pedido.completado:
            try:
                productos_pedido = json.loads(pedido.productos)  # Convertimos texto JSON a lista
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
