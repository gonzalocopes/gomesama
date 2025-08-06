# Imagen base oficial de Python
FROM python:3.13-slim

# Establecer directorio de trabajo
WORKDIR /app

# Evitar .pyc y habilitar logs inmediatos
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de requerimientos e instalarlos
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar el resto del proyecto
COPY . /app/

# Ejecutar collectstatic
RUN python manage.py collectstatic --noinput

# Exponer puerto
EXPOSE 8080

# Comando de inicio con Gunicorn optimizado
CMD ["gunicorn", "gomesama_backend.wsgi:application", "--bind", "0.0.0.0:8080", "--workers", "3", "--timeout", "120", "--max-requests", "1000", "--max-requests-jitter", "50"]
