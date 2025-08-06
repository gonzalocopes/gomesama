from django.db import models
from cloudinary.models import CloudinaryField
import json

class Producto(models.Model):
    CATEGORIAS = [
        ('Golosinas', 'Golosinas'),
        ('Salados', 'Salados'),
        ('Gaseosas', 'Gaseosas'),
        ('Galletitas', 'Galletitas'),
        ('Ramen', 'Ramen'),
        ('Postres', 'Postres'),
    ]

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    
    imagen = CloudinaryField(
        'image',
        folder="productos",
        blank=True,
        null=True,
        help_text="Formatos soportados: JPEG, PNG, GIF, WEBP. Tamaño máximo: 10MB"
    )

    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default="Golosinas")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['nombre']

class Pedido(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    telefono_cliente = models.CharField(max_length=20)
    productos = models.TextField()  # Almacenará JSON con los productos
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre_cliente}"

    def productos_lista(self):
        """Devuelve los productos como lista de diccionarios"""
        try:
            return json.loads(self.productos)
        except:
            return []

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-fecha']