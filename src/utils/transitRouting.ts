import { TRANSIT_LINES, type PublicOptionId } from './transitNetwork';

export interface PublicOptionMetrics {
  duration: number;
  distance: number;
  accessDistanceKm: number;
  inVehicleDistanceKm: number;
  waitMinutes: number;
  feasible: boolean;
  summary: string;
}

interface ProjectionResult {
  point: [number, number];
  index: number;
  distanceKm: number;
}

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (a: [number, number], b: [number, number]) => {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(x));
};

const interpolate = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + ((b[0] - a[0]) * t),
  a[1] + ((b[1] - a[1]) * t),
];

const projectToSegment = (point: [number, number], a: [number, number], b: [number, number]) => {
  const ax = a[1];
  const ay = a[0];
  const bx = b[1];
  const by = b[0];
  const px = point[1];
  const py = point[0];

  const abx = bx - ax;
  const aby = by - ay;
  const ab2 = (abx * abx) + (aby * aby);
  const tRaw = ab2 === 0 ? 0 : (((px - ax) * abx) + ((py - ay) * aby)) / ab2;
  const t = Math.max(0, Math.min(1, tRaw));
  const proj: [number, number] = [ay + (aby * t), ax + (abx * t)];

  return { point: proj, t, distanceKm: haversineKm(point, proj) };
};

const nearestPointOnPolyline = (point: [number, number], path: [number, number][]): ProjectionResult => {
  let best: ProjectionResult = { point: path[0], index: 0, distanceKm: Infinity };

  for (let i = 0; i < path.length - 1; i += 1) {
    const projection = projectToSegment(point, path[i], path[i + 1]);
    if (projection.distanceKm < best.distanceKm) {
      best = { point: projection.point, index: i, distanceKm: projection.distanceKm };
    }
  }

  return best;
};

const pathDistance = (points: [number, number][]) => {
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    total += haversineKm(points[i], points[i + 1]);
  }
  return total;
};

const slicePolyline = (
  path: [number, number][],
  start: ProjectionResult,
  end: ProjectionResult,
): [number, number][] => {
  if (start.index === end.index) {
    return [start.point, end.point];
  }

  const forward = start.index < end.index;
  if (forward) {
    return [start.point, ...path.slice(start.index + 1, end.index + 1), end.point];
  }

  return [start.point, ...path.slice(end.index + 1, start.index + 1).reverse(), end.point];
};

export const getPublicOptionMetrics = (
  origin: [number, number],
  destination: [number, number],
): Record<PublicOptionId, PublicOptionMetrics> => {
  const output = {} as Record<PublicOptionId, PublicOptionMetrics>;

  for (const line of TRANSIT_LINES) {
    const fromProjection = nearestPointOnPolyline(origin, line.path);
    const toProjection = nearestPointOnPolyline(destination, line.path);
    const inVehiclePath = slicePolyline(line.path, fromProjection, toProjection);

    const accessDistanceKm = fromProjection.distanceKm + toProjection.distanceKm;
    const inVehicleDistanceKm = pathDistance(inVehiclePath);
    const totalDistance = accessDistanceKm + inVehicleDistanceKm;

    const walkMinutes = (accessDistanceKm / 4.7) * 60;
    const waitMinutes = Math.max(2, line.headwayMinutes * 0.6);
    const rideMinutes = (inVehicleDistanceKm / line.averageSpeedKmh) * 60;

    const feasible = accessDistanceKm <= 2.6 && inVehicleDistanceKm >= 0.7;
    const duration = Math.round(walkMinutes + waitMinutes + rideMinutes);

    output[line.id] = {
      duration,
      distance: parseFloat(totalDistance.toFixed(1)),
      accessDistanceKm: parseFloat(accessDistanceKm.toFixed(1)),
      inVehicleDistanceKm: parseFloat(inVehicleDistanceKm.toFixed(1)),
      waitMinutes: Math.round(waitMinutes),
      feasible,
      summary: feasible
        ? `${line.label}: ~${Math.round(rideMinutes)} min à bord + ${Math.round(walkMinutes)} min de marche/connexion`
        : `${line.label}: accès long (${accessDistanceKm.toFixed(1)} km de marche)`
    };
  }

  return output;
};

export const buildPublicOptionPath = (
  origin: [number, number],
  destination: [number, number],
  optionId: PublicOptionId,
): [number, number][] => {
  const line = TRANSIT_LINES.find((item) => item.id === optionId);
  if (!line) return [origin, destination];

  const fromProjection = nearestPointOnPolyline(origin, line.path);
  const toProjection = nearestPointOnPolyline(destination, line.path);
  const inVehiclePath = slicePolyline(line.path, fromProjection, toProjection);

  return [origin, fromProjection.point, ...inVehiclePath, toProjection.point, destination];
};
