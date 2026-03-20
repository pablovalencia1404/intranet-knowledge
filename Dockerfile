# Usamos la imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalamos las librerías necesarias para que PHP pueda hablar con MongoDB
RUN apt-get update && apt-get install -y \
    libssl-dev \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Instalamos Composer para dependencias PHP
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Instalamos dependencias PHP antes de copiar todo el codigo para aprovechar cache
COPY composer.json ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

# Habilitamos el módulo de reescritura de Apache (útil para APIs)
RUN a2enmod rewrite

# Copiamos los archivos de tu PC al contenedor
COPY . /var/www/html/