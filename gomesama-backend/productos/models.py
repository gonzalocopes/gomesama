from django.db import models
import os

# Import condicional del storage
if os.environ.get("CLOUDINARY_URL"):
    from cloudinary_storage.storage import MediaCloudinaryStorage
    cloud_storage = MediaCloudinaryStorage()
else:
    from django.core.files.storage import FileSystemStorage
    cloud_storage = FileSystemStorage()


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

    imagen = models.ImageField(
        upload_to="productos/",
        storage=cloud_storage,  # 👈 usamos la variable elegida según entorno
        blank=True,
        null=True
    )

    categoria = models.CharField(max_length=50, choices=CATEGORIAS, default="Golosinas")

    def __str__(self):
        return self.nombre


class Pedido(models.Model):
    nombre_cliente = models.CharField(max_length=100)
    telefono_cliente = models.CharField(max_length=20)
    productos = models.TextField()  # Lista de productos como texto
    total = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    completado = models.BooleanField(default=False)

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre_cliente}"
