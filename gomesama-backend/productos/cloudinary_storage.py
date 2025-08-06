from django.core.files.storage import get_storage_class
from cloudinary_storage.storage import MediaCloudinaryStorage

class CustomMediaCloudinaryStorage(MediaCloudinaryStorage):
    def _save(self, name, content):
        try:
            # Verificar si el archivo es una imagen válida
            if content.content_type not in ['image/jpeg', 'image/png', 'image/gif', 'image/webp']:
                raise ValueError("Tipo de archivo no soportado")
            
            # Limitar tamaño a 10MB
            if content.size > 10 * 1024 * 1024:
                raise ValueError("El archivo es demasiado grande (máximo 10MB)")
            
            return super()._save(name, content)
        except Exception as e:
            print(f"Error al subir a Cloudinary: {str(e)}")
            raise

# Reemplaza el storage por defecto
MediaCloudinaryStorage = CustomMediaCloudinaryStorage