import { useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapContainer from './MapContainer';
import { STATUS_COLORS } from '@/config/mapbox';
import type { Household } from '@/data';

interface HouseholdMapOverlayProps {
  households: Household[];
  onHouseholdSelect?: (id: string) => void;
  className?: string;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function buildPopupHTML(household: Household): string {
  const statusColor = STATUS_COLORS[household.currentStatus] || '#6b7280';

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:220px;line-height:1.4;">
      <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px;">${household.familyName} Family</div>
      <div style="font-size:12px;color:#475569;margin-bottom:6px;">Head: ${household.headOfHousehold}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="display:inline-block;background:${statusColor}22;color:${statusColor};border-radius:9999px;padding:1px 8px;font-size:11px;font-weight:600;border:1px solid ${statusColor}44;">${formatStatus(household.currentStatus)}</span>
      </div>
      <div style="font-size:12px;color:#475569;">
        ${household.members.length} member${household.members.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;
}

export default function HouseholdMapOverlay({
  households,
  onHouseholdSelect,
  className = '',
}: HouseholdMapOverlayProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const addMarkers = useCallback(
    (map: mapboxgl.Map) => {
      clearMarkers();

      households.forEach((household) => {
        const popup = new mapboxgl.Popup({
          offset: 25,
          maxWidth: '250px',
          closeButton: true,
        }).setHTML(buildPopupHTML(household));

        const marker = new mapboxgl.Marker({
          color: STATUS_COLORS[household.currentStatus] || '#6b7280',
        })
          .setLngLat([household.lng, household.lat])
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          onHouseholdSelect?.(household.id);
        });

        markersRef.current.push(marker);
      });
    },
    [households, onHouseholdSelect, clearMarkers],
  );

  useEffect(() => {
    if (mapInstanceRef.current) {
      addMarkers(mapInstanceRef.current);
    }
  }, [addMarkers]);

  useEffect(() => {
    return () => {
      clearMarkers();
    };
  }, [clearMarkers]);

  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      mapInstanceRef.current = map;
      addMarkers(map);
    },
    [addMarkers],
  );

  return <MapContainer className={className} onMapReady={handleMapReady} />;
}
