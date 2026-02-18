"use client";

/**
 * Fetches a real street-following route from OSRM API with local adjustments
 */
export const getRealRoute = async (
  origin: [number, number],
  destination: [number, number],
  profile: 'foot' | 'bike' | 'car' = 'car'
): Promise<{ path: [number, number][], duration: number, distance: number }> => {
  try {
    const osrmProfile = profile === 'foot' ? 'foot' : profile === 'bike' ? 'bicycle' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') throw new Error('Route not found');

    const route = data.routes[0];
    const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    
    let durationMinutes = route.duration / 60;
    
    // Casablanca specific adjustments
    if (profile === 'car') {
      durationMinutes *= 1.5; // Traffic factor for Casablanca
    } else if (profile === 'foot') {
      durationMinutes *= 1.1; // Pedestrian crossing/crowd factor
    } else if (profile === 'bike') {
      durationMinutes *= 1.2; // Urban cycling factor
    }
    
    return {
      path,
      duration: Math.round(durationMinutes),
      distance: parseFloat((route.distance / 1000).toFixed(1))
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