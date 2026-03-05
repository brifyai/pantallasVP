# Configuración de Variables de Entorno en EasyPanel

## Pasos para configurar la app en EasyPanel

### 1. Variables de Entorno Requeridas

En EasyPanel, agrega las siguientes variables de entorno en la sección "Environment Variables":

```bash
# API URL (opcional - si tienes un backend)
VITE_API_URL=https://api.tu-dominio.com

# Google Maps API Key (opcional - para mapas personalizados)
VITE_GOOGLE_MAPS_API_KEY=tu_api_key_aqui

# Leaflet Tile Layer URL (opcional - para el mapa)
VITE_LEAFLET_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# Analytics (opcional)
VITE_GA_ID=G-XXXXXXXXXX

# Environment
VITE_ENV=production

# App Title
VITE_APP_TITLE=Vehicle Intelligence
```

### 2. Configuración del Build

En EasyPanel, configura el build command:

```bash
npm run build
```

### 3. Configuración del Start Command

Para producción, usa:

```bash
npm run preview
```

O si prefieres usar un servidor estático:

```bash
npx serve -s dist -l 3000
```

### 4. Puerto

Configura el puerto en `3000` o el que prefieras.

### 5. Notas Importantes

- Las variables de entorno en Vite deben comenzar con `VITE_` para estar disponibles en el frontend
- El archivo `.env` no se sube a Git (está en `.gitignore`)
- Para desarrollo local, copia `.env.example` a `.env` y configura los valores

### 6. Variables Opcionales

Si no necesitas configurar todas las variables, puedes dejarlas vacías o no agregarlas. La app funcionará con los valores por defecto.

### 7. Verificación

Después del despliegue, verifica que:
- La app carga correctamente
- Los mapas se muestran (si configuraste las API keys)
- No hay errores en la consola del navegador
