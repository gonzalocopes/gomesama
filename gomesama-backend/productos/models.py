from django.db import models

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

    # 👇 Sin definir storage explícito, usará DEFAULT_FILE_STORAGE (Cloudinary en producción)
    imagen = models.ImageField(upload_to="productos/", blank=True, null=True)

    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default="Golosinas")

    def __str__(self):
        return self.nombre


class Pedido(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    telefono_cliente = models.CharField(max_length=20)
    productos = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre_cliente}"
