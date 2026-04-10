import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { MAPBOX_TOKEN, MAP_DEFAULTS } from '@/config/mapbox';

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  style?: string;
  className?: string;
  interactive?: boolean;
  onMapReady?: (map: mapboxgl.Map) => void;
}

const isPlaceholderToken = MAPBOX_TOKEN.includes('placeholder');

export default function MapContainer({
  center = MAP_DEFAULTS.center,
  zoom = MAP_DEFAULTS.zoom,
  style = MAP_DEFAULTS.style,
  className = '',
  interactive = true,
  onMapReady,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (isPlaceholderToken || !containerRef.current || mapRef.current) return;

    (mapboxgl as Record<string, unknown>).accessToken = MAPBOX_TOKEN;

    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style,
        center,
        zoom,
        interactive,
        attributionControl: false,
      });

      if (!interactive) {
        map.dragPan.disable();
        map.scrollZoom.disable();
        map.touchZoomRotate.disable();
        map.doubleClickZoom.disable();
        map.keyboard.disable();
        map.dragRotate.disable();
        map.touchPitch.disable();
      }

      map.on('load', () => {
        onMapReady?.(map);
      });

      map.on('error', () => {
        setMapError(true);
      });

      mapRef.current = map;
    } catch {
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPlaceholderToken || mapError) {
    return (
      <div
        className={`glass-card relative flex flex-col items-center justify-center gap-3 overflow-hidden ${className}`}
        style={{ minHeight: 300 }}
      >
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 40%, #d1fae5 100%)',
          }}
        />
        <MapPin className="h-10 w-10 text-slate-400" />
        <p className="text-sm font-medium text-slate-500">
          Map requires Mapbox token
        </p>
        <p className="text-xs text-slate-400">
          Set VITE_MAPBOX_TOKEN in your environment
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={className} style={{ minHeight: 300 }} />;
}
