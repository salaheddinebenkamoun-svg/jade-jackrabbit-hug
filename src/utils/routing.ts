"use client";

/**
 * Fetches a real street-following route from OSRM API
 * @param profile 'foot', 'bike', or 'car'
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
    // OSRM returns [lng, lat], we need [lat, lng]
    const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    
    return {
      path,
      duration: Math.round(route.duration / 60), // minutes
      distance: (route.distance / 1000).toFixed(1) as any // km
    };
  } catch (error) {
    console.error("Routing error:", error);
    // Fallback to straight line if API fails
    return {
      path: [origin, destination],
      duration: 0,
      distance: 0
    };
  }
};