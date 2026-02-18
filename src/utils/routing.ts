"use client";

import { buildPublicOptionPath, getPublicOptionMetrics } from './transitRouting';
import type { PublicOptionId } from './transitNetwork';

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
): Promise<RouteResult> => {
  const coords = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== 'Ok' || !Array.isArray(data.routes) || data.routes.length === 0) {
    throw new Error('Route not found');
  }

  return decodeRoute(data.routes[0]);
};

export const getRealRoute = async (
  origin: [number, number],
  destination: [number, number],
  profile: RoutingProfile = 'car'
): Promise<RouteResult> => {
  try {
    const osrmProfile = OSRM_PROFILE_BY_MODE[profile];
    const route = await fetchRoute([origin, destination], osrmProfile);

    let durationMinutes = route.duration;
    const distanceKm = route.distance;

    if (profile === 'foot') {
      durationMinutes = Math.max(durationMinutes * 1.1, (distanceKm / 5) * 60);
    } else if (profile === 'bike') {
      durationMinutes = Math.max(durationMinutes * 1.15, (distanceKm / 16) * 60);
    } else if (profile === 'taxi' || profile === 'car') {
      const trafficFactor = distanceKm < 3 ? 2.2 : 1.6;
      durationMinutes = (durationMinutes * trafficFactor) + 4;
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

export const getRouteByOption = async (
  origin: [number, number],
  destination: [number, number],
  optionId: string,
  mode: Exclude<RoutingProfile, 'car'>
): Promise<RouteResult> => {
  if (mode === 'foot' || mode === 'bike' || mode === 'taxi') {
    return getRealRoute(origin, destination, mode);
  }

  const metrics = getPublicOptionMetrics(origin, destination)[optionId as PublicOptionId];
  if (!metrics) {
    return getRealRoute(origin, destination, 'taxi');
  }

  return {
    path: buildPublicOptionPath(origin, destination, optionId as PublicOptionId),
    duration: metrics.duration,
    distance: metrics.distance,
  };
};
