import MapContainer from './MapContainer';
import { MAPBOX_TOKEN } from '@/config/mapbox';

interface LandingMapDecorationProps {
  className?: string;
}

const isPlaceholderToken = !MAPBOX_TOKEN || MAPBOX_TOKEN.includes('placeholder');

export default function LandingMapDecoration({
  className = '',
}: LandingMapDecorationProps) {
  if (isPlaceholderToken) {
    return (
      <div
        className={`rounded-xl pointer-events-none opacity-30 ${className}`}
        style={{
          minHeight: 300,
          background:
            'linear-gradient(135deg, #e0e7ff 0%, #dbeafe 40%, #d1fae5 100%)',
        }}
      />
    );
  }

  return (
    <div className={`pointer-events-none opacity-30 overflow-hidden rounded-xl ${className}`}>
      <MapContainer interactive={false} className="h-full w-full" />
    </div>
  );
}
