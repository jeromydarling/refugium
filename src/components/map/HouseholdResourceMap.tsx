/**
 * HouseholdResourceMap — "Look at all this help waiting for you"
 *
 * Shows a map centered on a household's location with pins for:
 * - The household itself (home marker)
 * - Their matched partners/resources (with toggle: active vs all)
 * - Nearby services (shelters, food, medical, etc.)
 *
 * This is a hope marker — a survivor sees their neighborhood
 * full of organizations ready to help them rebuild.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, MAP_DEFAULTS, PARTNER_TYPE_COLORS } from '@/config/mapbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, EyeOff, Home, Loader2 } from 'lucide-react';
import type { Partner } from '@/data';

interface HouseholdResourceMapProps {
  householdName: string;
  householdLat: number;
  householdLng: number;
  activePartnerIds?: string[];
  partners: Partner[];
  className?: string;
}

export default function HouseholdResourceMap({
  householdName,
  householdLat,
  householdLng,
  activePartnerIds = [],
  partners,
  className = '',
}: HouseholdResourceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  const isPlaceholder = !MAPBOX_TOKEN || MAPBOX_TOKEN.includes('placeholder');

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || isPlaceholder) return;

    try {
      (mapboxgl as any).accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAP_DEFAULTS.style,
        center: [householdLng, householdLat],
        zoom: 12,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        mapRef.current = map;
        setMapReady(true);
      });

      map.on('error', (e) => {
        console.error('[HouseholdResourceMap] Mapbox error:', e);
        setMapError(true);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch {
      setMapError(true);
    }
  }, [householdLat, householdLng, isPlaceholder]);

  // Add/update markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapRef.current;

    // Home marker (the household)
    const homeEl = document.createElement('div');
    homeEl.innerHTML = `<div style="width:36px;height:36px;border-radius:50%;background:hsl(196,65%,30%);border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>`;

    const homeMarker = new mapboxgl.Marker({ element: homeEl })
      .setLngLat([householdLng, householdLat])
      .setPopup(new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(
        `<div style="padding:8px;font-family:Inter,sans-serif">
          <p style="font-weight:600;font-size:13px;margin:0">${householdName}</p>
          <p style="color:#888;font-size:11px;margin:2px 0 0">Home location</p>
        </div>`
      ))
      .addTo(map);
    markersRef.current.push(homeMarker);

    // Partner/resource markers
    const visiblePartners = showAll
      ? partners
      : partners.filter(p => activePartnerIds.includes(p.id));

    visiblePartners.forEach(partner => {
      const color = PARTNER_TYPE_COLORS[partner.type] || '#6b7280';
      const isActive = activePartnerIds.includes(partner.id);

      const marker = new mapboxgl.Marker({ color })
        .setLngLat([partner.lng, partner.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25, maxWidth: '260px' }).setHTML(
          `<div style="padding:10px;font-family:Inter,sans-serif">
            <p style="font-weight:600;font-size:13px;margin:0">${partner.name}</p>
            <p style="color:#888;font-size:11px;margin:3px 0">${partner.type.replace('_', ' ')} · ${partner.contactPerson}</p>
            <div style="margin:6px 0;display:flex;flex-wrap:wrap;gap:3px">
              ${partner.services.slice(0, 3).map(s =>
                `<span style="background:#f0f0f0;padding:1px 6px;border-radius:8px;font-size:10px">${s}</span>`
              ).join('')}
            </div>
            <p style="font-size:11px;margin:4px 0 0">📞 ${partner.phone}</p>
            ${isActive ? '<p style="color:#16a34a;font-size:10px;font-weight:600;margin:4px 0 0">✓ Active resource for this family</p>' : ''}
            ${partner.notes ? `<p style="font-style:italic;color:#888;font-size:10px;margin:4px 0 0">${partner.notes}</p>` : ''}
          </div>`
        ))
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [mapReady, partners, showAll, activePartnerIds, householdName, householdLat, householdLng]);

  // Fallback for no token
  if (isPlaceholder || mapError) {
    return (
      <div className={`rounded-xl overflow-hidden ${className}`}>
        <div className="h-full min-h-[300px] bg-gradient-to-br from-[hsl(var(--ignatian-cream))] to-[hsl(var(--ignatian-bg-end))] flex items-center justify-center border border-[hsl(var(--ignatian-border))]">
          <div className="text-center p-6">
            <MapPin className="w-10 h-10 text-[hsl(var(--ignatian-gold))] mx-auto mb-3" />
            <p className="text-sm font-serif font-medium text-[hsl(var(--ignatian-brown))]">Resource map</p>
            <p className="text-xs text-[hsl(var(--ignatian-muted))] mt-1">{partners.length} organizations nearby ready to help</p>
            <p className="text-[10px] text-[hsl(var(--ignatian-muted))] mt-2">
              {isPlaceholder ? 'No token' : mapError ? 'Map error — check console' : 'Loading...'}
              {' · Token: '}{MAPBOX_TOKEN ? MAPBOX_TOKEN.slice(0, 10) + '...' : 'empty'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-[hsl(var(--ignatian-border))] ${className}`}>
      {/* Toggle bar */}
      <div className="bg-[hsl(var(--ignatian-cream))] border-b border-[hsl(var(--ignatian-border))] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">
            {showAll ? `${partners.length} organizations nearby` : `${activePartnerIds.length} active resources`}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1.5"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <><Eye className="h-3 w-3" /> All resources</>
          ) : (
            <><EyeOff className="h-3 w-3" /> Active only</>
          )}
        </Button>
      </div>

      {/* Map */}
      <div ref={containerRef} className="h-[300px] lg:h-[400px]" />

      {/* Legend */}
      <div className="bg-[hsl(var(--ignatian-cream))] border-t border-[hsl(var(--ignatian-border))] px-3 py-2 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-full bg-primary border border-white shadow-sm" /> Home
        </span>
        {Object.entries(PARTNER_TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: color }} />
            {type.replace('_', ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}
