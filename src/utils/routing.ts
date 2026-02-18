"use client";

type RoutingProfile = 'foot' | 'bike' | 'taxi' | 'tramway' | 'busway' | 'bus' | 'car';

type RouteResult = { path: [number, number][], duration: number, distance: number };

const OSRM_PROFILE_BY_MODE: Record<RoutingProfile, 'walking' | 'cycling' | 'driving'> = {
  foot: 'walking',
  bike: 'cycling',
  taxi: 'driving',
  tramway: 'driving',
  busway: 'driving',
  bus: 'driving',
  car: 'driving',
};

interface OsrmRoute {
  duration: number;
  distance: number;
  geometry: {
    coordinates: [number, number][];
  };
}

const decodeRoute = (route: OsrmRoute): RouteResult => {
  const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
  const distanceKm = route.distance / 1000;

  return {
    path,
    duration: route.duration / 60,
    distance: distanceKm,
  };
};

const fetchRoute = async (
  points: [number, number][],
  profile: 'walking' | 'cycling' | 'driving',
  alternatives = false
): Promise<RouteResult[]> => {
  const coords = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson&alternatives=${alternatives ? 'true' : 'false'}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) {
    throw new Error('Route not found');
  }

  return data.routes.map(decodeRoute);
};

/**
 * Fetches a real street-following route from OSRM API with mode-specific profiles
 */
export const getRealRoute = async (
  origin: [number, number],
  destination: [number, number],
  profile: RoutingProfile = 'car'
): Promise<RouteResult> => {
  try {
    const osrmProfile = OSRM_PROFILE_BY_MODE[profile];
    const [route] = await fetchRoute([origin, destination], osrmProfile);

    let durationMinutes = route.duration;
    const distanceKm = route.distance;

    /**
     * LOGICAL CALIBRATION FOR CASABLANCA
     * 1. Walking: ~4-5 km/h (OSRM base is usually okay, but we add 10% for lights/crowds)
     * 2. Cycling: ~12-15 km/h (OSRM base is okay, we add 15% for urban obstacles)
     * 3. Car: Highly variable. We add a heavy traffic multiplier (1.6x) + 5 mins for parking/start.
     * 4. Public: Tram/Busway have dedicated lanes but stops. We use car base + 1.2x + 8 mins wait.
     */

    if (profile === 'foot') {
      const calibrated = durationMinutes * 1.1;
      const realisticMinimum = (distanceKm / 5) * 60;
      durationMinutes = Math.max(calibrated, realisticMinimum);
    } else if (profile === 'bike') {
      const calibrated = durationMinutes * 1.15;
      const realisticMinimum = (distanceKm / 16) * 60;
      durationMinutes = Math.max(calibrated, realisticMinimum);
    } else if (profile === 'taxi' || profile === 'car') {
      // In Casa, short trips take longer due to traffic density.
      const trafficFactor = distanceKm < 3 ? 2.2 : 1.6;
      durationMinutes = (durationMinutes * trafficFactor) + 4;
    } else if (profile === 'tramway') {
      // Frequent stops + average waiting time, but often less affected by traffic.
      durationMinutes = (durationMinutes * 1.05) + 7;
    } else if (profile === 'busway') {
      // Dedicated corridors help compared to regular buses.
      durationMinutes = (durationMinutes * 1.15) + 6;
    } else if (profile === 'bus') {
      // More stops, mixed traffic, extra waiting variability.
      durationMinutes = (durationMinutes * 1.4) + 8;
    }

    return {
      path: route.path,
      duration: Math.max(1, Math.round(durationMinutes)),
      distance: parseFloat(distanceKm.toFixed(1))
    };
  } catch (error) {
    console.error("Routing error:", error);
    return {
      path: [origin, destination],
      duration: 0,
      distance: 0
    };
  }
};

const createViaPoint = (
  origin: [number, number],
  destination: [number, number],
  lateralOffset: number
): [number, number] => {
  const [lat1, lng1] = origin;
  const [lat2, lng2] = destination;

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const norm = Math.sqrt((dLat * dLat) + (dLng * dLng)) || 1;

  const perpendicularLat = -dLng / norm;
  const perpendicularLng = dLat / norm;

  return [
    midLat + (perpendicularLat * lateralOffset),
    midLng + (perpendicularLng * lateralOffset),
  ];
};

/**
 * Returns the route for a selected option while keeping real road-aligned geometry.
 */
export const getRouteByOption = async (
  origin: [number, number],
  destination: [number, number],
  optionId: string,
  mode: Exclude<RoutingProfile, 'car'>
): Promise<RouteResult> => {
  if (mode === 'foot' || mode === 'bike' || mode === 'taxi') {
    return getRealRoute(origin, destination, mode);
  }

  const variants: Record<string, { lateralOffset: number; alternativeIndex: number }> = {
    t1: { lateralOffset: 0.015, alternativeIndex: 0 },
    t2: { lateralOffset: -0.018, alternativeIndex: 1 },
    t3: { lateralOffset: 0.022, alternativeIndex: 2 },
    t4: { lateralOffset: -0.025, alternativeIndex: 0 },
    bw1: { lateralOffset: 0.012, alternativeIndex: 1 },
    bw2: { lateralOffset: -0.012, alternativeIndex: 2 },
    bus_lissasfa_nations_unies: { lateralOffset: 0.03, alternativeIndex: 0 },
    bus_hay_hassani_ain_sebaa: { lateralOffset: -0.034, alternativeIndex: 1 },
    bus_sidi_moumen_oulfa: { lateralOffset: 0.038, alternativeIndex: 2 },
  };

  const variant = variants[optionId];
  if (!variant) {
    return getRealRoute(origin, destination, mode);
  }

  try {
    const viaPoint = createViaPoint(origin, destination, variant.lateralOffset);
    const [route] = await fetchRoute([origin, viaPoint, destination], 'driving');
    return {
      path: route.path,
      duration: Math.max(1, Math.round(route.duration)),
      distance: parseFloat(route.distance.toFixed(1)),
    };
  } catch (error) {
    console.warn(`Could not compute waypoint route for ${optionId}, trying alternatives`, error);
  }

  try {
    const alternatives = await fetchRoute([origin, destination], 'driving', true);
    const pickedRoute = alternatives[variant.alternativeIndex % alternatives.length] ?? alternatives[0];
    return {
      path: pickedRoute.path,
      duration: Math.max(1, Math.round(pickedRoute.duration)),
      distance: parseFloat(pickedRoute.distance.toFixed(1)),
    };
  } catch (error) {
    console.warn(`Could not compute alternative route for ${optionId}, using default mode route`, error);
    return getRealRoute(origin, destination, mode);
  }
};
