export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidHJhbnNpdHUiLCJhIjoiY21uczVqOWVwMGFibzJxb24yazQ0ZGExZSJ9.YhRbPB1u7gFQmlvoEqfXsA';

export const MAP_DEFAULTS = {
  center: [-91.1871, 30.4515] as [number, number],
  zoom: 7,
  // Custom vintage style — using streets-v12 as reliable fallback
  // Your custom style: mapbox://styles/transitu/cmns7i5r4000001si3upk9hai
  style: 'mapbox://styles/mapbox/streets-v12',
};

export const PARTNER_TYPE_COLORS: Record<string, string> = {
  church: '#9333ea',
  nonprofit: '#2563eb',
  government: '#6b7280',
  host_family: '#ec4899',
  business: '#16a34a',
};

export const STATUS_COLORS: Record<string, string> = {
  acute: '#dc2626',
  stabilizing: '#d97706',
  rebuilding: '#2563eb',
  recovered: '#16a34a',
};
