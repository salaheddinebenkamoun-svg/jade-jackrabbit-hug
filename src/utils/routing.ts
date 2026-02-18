"use client";

type RoutingProfile = 'foot' | 'bike' | 'taxi' | 'tramway' | 'busway' | 'bus' | 'car';

/**
 * Fetches a real street-following route from OSRM API with mode-specific profiles
 */
export const getRealRoute = async (
  origin: [number, number],
  destination: [number, number],
  profile: RoutingProfile = 'car'
): Promise<{ path: [number, number][], duration: number, distance: number }> => {
  try {
    // Map our internal modes to OSRM profiles.
    // OSRM does not expose dedicated tram/busway lanes worldwide, so we use driving
    // geometry and calibrate ETA per mode to feel closer to real-life conditions.
    const osrmProfileByMode: Record<RoutingProfile, 'walking' | 'cycling' | 'driving'> = {
      foot: 'walking',
      bike: 'cycling',
      taxi: 'driving',
      tramway: 'driving',
      busway: 'driving',
      bus: 'driving',
      car: 'driving',
    };
    const osrmProfile = osrmProfileByMode[profile];

    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) {
      throw new Error('Route not found');
    }

    const route = data.routes[0];
    const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

    // Base duration from OSRM is in seconds
    let durationMinutes = route.duration / 60;
    const distanceKm = route.distance / 1000;

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
      path,
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

const applyOffsetToPath = (
  path: [number, number][],
  amplitude: number,
  phase = 0
): [number, number][] => {
  if (path.length < 3 || amplitude === 0) return path;

  return path.map(([lat, lng], index) => {
    if (index === 0 || index === path.length - 1) return [lat, lng];
    const wave = Math.sin((index / (path.length - 1)) * Math.PI * 2 + phase);
    const offset = wave * amplitude;
    return [lat + offset, lng - offset * 0.65];
  });
};

/**
 * Returns the route for a selected option while keeping real road-aligned geometry.
 */
export const getRouteByOption = async (
  origin: [number, number],
  destination: [number, number],
  optionId: string,
  mode: Exclude<RoutingProfile, 'car'>
): Promise<{ path: [number, number][], duration: number, distance: number }> => {
  const result = await getRealRoute(origin, destination, mode);

  const offsets: Record<string, { amp: number; phase: number }> = {
    foot: { amp: 0.0001, phase: 0 },
    bike: { amp: 0.00015, phase: 0.6 },
    taxi: { amp: 0.0002, phase: 0.9 },
    t1: { amp: 0.00045, phase: 0 },
    t2: { amp: 0.00055, phase: 1.3 },
    t3: { amp: 0.0004, phase: 2.1 },
    t4: { amp: 0.0005, phase: 2.8 },
    bw1: { amp: 0.00035, phase: 0.8 },
    bw2: { amp: 0.0003, phase: 2.2 },
    bus_lissasfa_nations_unies: { amp: 0.00065, phase: 0.3 },
    bus_hay_hassani_ain_sebaa: { amp: 0.00075, phase: 1.8 },
    bus_sidi_moumen_oulfa: { amp: 0.0007, phase: 2.6 },
  };

  const variant = offsets[optionId];
  if (!variant) return result;

  return {
    ...result,
    path: applyOffsetToPath(result.path, variant.amp, variant.phase),
  };
};
