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
    const osrmProfile = 
      profile === 'foot' ? 'foot' : 
      profile === 'bike' ? 'bicycle' : 
      'driving'; // 'car' and 'public' use driving network but different speeds

    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${origin[1]},${origin[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') throw new Error('Route not found');

    const route = data.routes[0];
    const path = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    
    let durationMinutes = route.duration / 60;
    
    // Casablanca-specific logic for "Logical Times"
    if (profile === 'car') {
      // Petit Taxi: High traffic factor + finding a taxi time
      durationMinutes = (durationMinutes * 1.8) + 3; 
    } else if (profile === 'foot') {
      // Walking: Slower in busy areas like Maarif or Centre Ville
      durationMinutes = durationMinutes * 1.15;
    } else if (profile === 'bike') {
      // Cycling: Urban obstacles and safety stops
      durationMinutes = durationMinutes * 1.3;
    } else if (profile === 'public') {
      // Public Transport: Driving time + stops + average wait time (10 mins)
      durationMinutes = (durationMinutes * 1.4) + 10;
    }
    
    return {
      path,
      duration: Math.max(1, Math.round(durationMinutes)),
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