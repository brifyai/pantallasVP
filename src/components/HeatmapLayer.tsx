import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  radius?: number;
  blur?: number;
  maxZoom?: number;
  gradient?: Record<number, string>;
}

export function HeatmapLayer({ 
  points, 
  radius = 25, 
  blur = 15, 
  maxZoom = 14,
  gradient 
}: HeatmapLayerProps) {
  const map = useMap();
  const heatmapRef = useRef<any>(null);

  // Gradiente por defecto
  const defaultGradient = {
    0.0: '#000080',
    0.2: '#00ffff',
    0.4: '#00ff00',
    0.6: '#ffff00',
    0.8: '#ff8000',
    1.0: '#ff0000'
  };

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Limpiar capa anterior si existe
    if (heatmapRef.current) {
      map.removeLayer(heatmapRef.current);
    }

    try {
      const layer = (L as any).heatLayer(points, {
        radius: radius,
        blur: blur,
        maxZoom: maxZoom,
        gradient: gradient || defaultGradient,
        minOpacity: 0.4
      });
      layer.addTo(map);
      heatmapRef.current = layer;
    } catch (error) {
      console.error('Heatmap: error creando capa:', error);
    }

    return () => {
      if (heatmapRef.current) {
        map.removeLayer(heatmapRef.current);
        heatmapRef.current = null;
      }
    };
  }, [map, points, radius, blur, maxZoom, gradient]);

  return null;
}
