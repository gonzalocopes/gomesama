from rest_framework import serializers
from .models import Producto, Pedido

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'
        read_only_fields = ('id',)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.imagen:
            representation['imagen'] = instance.imagen.url
        return representation

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'