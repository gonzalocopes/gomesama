from django.contrib import admin, messages
from .models import Producto, Pedido
import json
from django.utils.html import format_html
from django import forms

class ProductoAdminForm(forms.ModelForm):
    class Meta:
        model = Producto
        fields = '__all__'
    
    def clean_imagen(self):
        imagen = self.cleaned_data.get('imagen')
        if imagen:
            # Validar tamaño máximo (10MB)
            if hasattr(imagen, 'size') and imagen.size > 10 * 1024 * 1024:
                raise forms.ValidationError("La imagen es demasiado grande (máximo 10MB)")
            
            # Validar tipos de archivo
            if hasattr(imagen, 'content_type'):
                valid_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                if imagen.content_type not in valid_types:
                    raise forms.ValidationError("Formato de imagen no soportado. Use JPEG, PNG, GIF o WEBP")
        
        return imagen

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    form = ProductoAdminForm
    list_display = ('nombre', 'precio', 'stock', 'mostrar_imagen', 'categoria')
    search_fields = ('nombre',)
    list_filter = ('stock', 'categoria')
    readonly_fields = ('mostrar_imagen',)
    
    def mostrar_imagen(self, obj):
        if obj.imagen:
            return format_html('<img src="{}" width="50" style="border-radius: 5px;" />', obj.imagen.url)
        return "-"
    mostrar_imagen.short_description = "Imagen"

    def save_model(self, request, obj, form, change):
        try:
            # Django-cloudinary-storage maneja automáticamente la subida
            super().save_model(request, obj, form, change)
            messages.success(request, f"Producto '{obj.nombre}' guardado correctamente.")
        except Exception as e:
            messages.error(request, f"Error al guardar el producto: {str(e)}")
            raise

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre_cliente', 'mostrar_productos', 'total', 'estado_coloreado', 'fecha')
    list_filter = ('completado', 'fecha')
    search_fields = ('nombre_cliente', 'telefono_cliente')
    actions = ['marcar_completado']
    readonly_fields = ('fecha',)

    def get_queryset(self, request):
        """
        Mostrar primero los pedidos pendientes por defecto
        """
        qs = super().get_queryset(request)
        return qs.order_by('completado', '-fecha')

    def changelist_view(self, request, extra_context=None):
        """
        Filtrar automáticamente por completado=False al abrir el admin
        """
        if not request.GET.get('completado__exact'):
            q = request.GET.copy()
            q['completado__exact'] = '0'
            request.GET = q
            request.META['QUERY_STRING'] = request.GET.urlencode()
        return super().changelist_view(request, extra_context=extra_context)

    def mostrar_productos(self, obj):
        """
        Mostrar productos en formato amigable
        """
        try:
            productos = json.loads(obj.productos)
            return format_html("<br>".join([f"{p['nombre']} x{p['cantidad']}" for p in productos]))
        except Exception:
            return obj.productos
    mostrar_productos.short_description = "Productos"

    def estado_coloreado(self, obj):
        """
        Mostrar estado con color
        """
        color = "green" if obj.completado else "red"
        texto = "Completado" if obj.completado else "Pendiente"
        return format_html(f'<b style="color:{color}">{texto}</b>')
    estado_coloreado.short_description = "Estado"

    def save_model(self, request, obj, form, change):
        """
        Al guardar un pedido como completado, descontar stock
        """
        if obj.completado:  # Si está marcado como completado
            try:
                productos_pedido = json.loads(obj.productos)
                for prod in productos_pedido:
                    try:
                        producto = Producto.objects.get(id=prod["id"])
                        if producto.stock >= prod["cantidad"]:
                            producto.stock -= prod["cantidad"]
                            producto.save()
                    except Producto.DoesNotExist:
                        pass
                messages.success(request, "✅ Stock actualizado correctamente.")
            except Exception as e:
                messages.error(request, f"⚠️ Error al actualizar stock: {e}")
        super().save_model(request, obj, form, change)

    def marcar_completado(self, request, queryset):
        """
        Acción masiva: marcar pedidos como completados y descontar stock
        """
        for pedido in queryset:
            if not pedido.completado:
                pedido.completado = True
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
                    pedido.save()
                except Exception as e:
                    messages.error(request, f"⚠️ Error en pedido {pedido.id}: {e}")
        messages.success(request, "✅ Pedidos completados y stock actualizado.")
    marcar_completado.short_description = "Marcar pedidos como completados"