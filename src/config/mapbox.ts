export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export const MAP_DEFAULTS = {
  center: [-91.1871, 30.4515] as [number, number],
  zoom: 7,
  // Community Standard Oil Company vintage style (inspired by 1910s Standard Oil road maps)
  style: 'mapbox://styles/mapbox-map-design/ckr0svm3922ki18qntevm857n',
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
