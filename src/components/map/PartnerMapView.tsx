import { useCallback, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapContainer from './MapContainer';
import { PARTNER_TYPE_COLORS } from '@/config/mapbox';
import type { Partner } from '@/data';

interface PartnerMapViewProps {
  partners: Partner[];
  selectedPartnerId?: string;
  onPartnerSelect?: (id: string) => void;
  className?: string;
}

function formatPartnerType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function capacityBadgeColor(capacity: Partner['capacity']): string {
  switch (capacity) {
    case 'available':
      return '#16a34a';
    case 'limited':
      return '#d97706';
    case 'full':
      return '#dc2626';
  }
}

function buildPopupHTML(partner: Partner): string {
  const typeColor = PARTNER_TYPE_COLORS[partner.type] || '#6b7280';
  const capColor = capacityBadgeColor(partner.capacity);
  const servicesHtml = partner.services
    .slice(0, 3)
    .map(
      (s) =>
        `<span style="display:inline-block;background:#f1f5f9;border-radius:4px;padding:1px 6px;font-size:11px;color:#334155;margin:1px 2px;">${s}</span>`,
    )
    .join('');

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:240px;line-height:1.4;">
      <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px;">${partner.name}</div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
        <span style="display:inline-block;background:${typeColor};color:#fff;border-radius:9999px;padding:1px 8px;font-size:11px;font-weight:600;">${formatPartnerType(partner.type)}</span>
        <span style="display:inline-block;background:${capColor}22;color:${capColor};border-radius:9999px;padding:1px 8px;font-size:11px;font-weight:600;border:1px solid ${capColor}44;">${partner.capacity}</span>
      </div>
      <div style="margin-bottom:6px;">${servicesHtml}</div>
      <div style="font-size:12px;color:#475569;">
        <div><span style="font-weight:600;">${partner.contactPerson}</span></div>
        <div>${partner.phone}</div>
      </div>
    </div>
  `;
}

export default function PartnerMapView({
  partners,
  selectedPartnerId,
  onPartnerSelect,
  className = '',
}: PartnerMapViewProps) {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const addMarkers = useCallback(
    (map: mapboxgl.Map) => {
      clearMarkers();

      partners.forEach((partner) => {
        const popup = new mapboxgl.Popup({
          offset: 25,
          maxWidth: '280px',
          closeButton: true,
        }).setHTML(buildPopupHTML(partner));

        const marker = new mapboxgl.Marker({
          color: PARTNER_TYPE_COLORS[partner.type] || '#6b7280',
        })
          .setLngLat([partner.lng, partner.lat])
          .setPopup(popup)
          .addTo(map);

        const el = marker.getElement();
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          onPartnerSelect?.(partner.id);
        });

        if (partner.id === selectedPartnerId) {
          marker.togglePopup();
        }

        markersRef.current.push(marker);
      });
    },
    [partners, selectedPartnerId, onPartnerSelect, clearMarkers],
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
