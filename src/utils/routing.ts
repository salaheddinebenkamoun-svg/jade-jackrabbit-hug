"use client";

/**
 * Fetches a real street-following route from OSRM API with mode-specific profiles
 */
export const getRealRoute = async (
  origin: [number, number],
  destination: [number, number],
  profile: 'foot' | 'bike' | 'car' | 'public' = 'car'
): Promise<{ path: [number, number][], duration: number, distance: number }> => {
  try {
    // Map our internal modes to OSRM profiles
    // OSRM 'driving' is used for both car and public transport as a base
    const osrmProfile = 
      profile === 'foot' ? 'foot' : 
      profile === 'bike' ? 'bicycle' : 
      'driving';

    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') throw new Error('Route not found');

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
      durationMinutes = durationMinutes * 1.1;
    } else if (profile === 'bike') {
      durationMinutes = durationMinutes * 1.15;
    } else if (profile === 'car') {
      // In Casa, short trips take longer due to traffic density
      const trafficFactor = distanceKm < 3 ? 2.2 : 1.6;
      durationMinutes = (durationMinutes * trafficFactor) + 4; 
    } else if (profile === 'public') {
      // Tram/Busway is often faster than cars in peak traffic due to dedicated lanes
      durationMinutes = (durationMinutes * 1.1) + 8; // 8 mins average wait time
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