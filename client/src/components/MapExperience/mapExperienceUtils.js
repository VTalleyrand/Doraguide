import { appMarkerColors } from './mapExperienceData';

export const markerStyleForCategory = (category) => ({
  color: appMarkerColors[category] || appMarkerColors.Cultural,
  glyphColor: '#ffffff',
  glyphText: 'D',
});

export const markerColorForCategory = (category) =>
  appMarkerColors[category] || appMarkerColors.Cultural;

export const formatClock = (totalSeconds) => {
  const t = Number.isFinite(totalSeconds)
    ? Math.max(0, Math.floor(totalSeconds))
    : 0;
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const parseClockLabelToSeconds = (label) => {
  if (!label || typeof label !== 'string') return 0;
  const match = label.trim().match(/^(\d+):(\d{2})$/);
  if (!match) return 0;
  const m = Number(match[1]);
  const s = Number(match[2]);
  if (!Number.isFinite(m) || !Number.isFinite(s) || s > 59) return 0;
  return m * 60 + s;
};

export const readTokenExpiry = (token) => {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return null;
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '='
    );
    const payload = JSON.parse(window.atob(padded));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isMapKitAlreadyInitializedError = (error) => {
  const message =
    typeof error?.message === 'string' ? error.message.toLowerCase() : '';
  return message.includes('already') && message.includes('initial');
};

export const computeBounds = (stops) => {
  const initial = stops[0].coordinate;
  let minLat = initial.latitude;
  let maxLat = initial.latitude;
  let minLon = initial.longitude;
  let maxLon = initial.longitude;

  stops.forEach((stop) => {
    const { latitude, longitude } = stop.coordinate;
    minLat = Math.min(minLat, latitude);
    maxLat = Math.max(maxLat, latitude);
    minLon = Math.min(minLon, longitude);
    maxLon = Math.max(maxLon, longitude);
  });

  const paddingFactor = 1.35;
  const latDelta = Math.max(0.02, (maxLat - minLat) * paddingFactor);
  const lonDelta = Math.max(0.02, (maxLon - minLon) * paddingFactor);

  return {
    centerLat: (minLat + maxLat) / 2,
    centerLon: (minLon + maxLon) / 2,
    spanLat: latDelta,
    spanLon: lonDelta,
  };
};
