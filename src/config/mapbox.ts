export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoidHJhbnNpdHUiLCJhIjoiY21udDZyM3JxMGo1azJycTI1dWp2YXgwOCJ9.V7G9XaJxCCMtwRrO_TE9KA';

export const MAP_DEFAULTS = {
  center: [-91.1871, 30.4515] as [number, number],
  zoom: 7,
  // Custom vintage style
  style: 'mapbox://styles/transitu/cmns7i5r4000001si3upk9hai',
};

export const PARTNER_TYPE_COLORS: Record<string, string> = {
  church: '#6d5a8a',
  nonprofit: '#5a7a9a',
  government: '#7a7a72',
  host_family: '#b07a7a',
  business: '#6a8a6a',
};

export const STATUS_COLORS: Record<string, string> = {
  acute: '#b05050',
  stabilizing: '#b08a50',
  rebuilding: '#5a7a9a',
  recovered: '#6a8a6a',
};
