import L from 'leaflet';

// leaflet.markercluster's UMD bundle reads the global `L` instead of
// importing it, so it must be set before that side-effect import runs.
(window as unknown as { L: typeof L }).L = L;

export default L;
