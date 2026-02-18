"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const OriginIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const DestinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 39px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface TransportMapProps {
  center: [number, number];
  origin: [number, number] | null;
  destination: [number, number] | null;
  selectedRoutePath: [number, number][] | null;
  previewPath: [number, number][] | null;
  pathColor?: string;
  isPublicTransport?: boolean;
  onMapClick: (latlng: [number, number]) => void;
}

function MapEvents({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ChangeView({ center, origin, destination, selectedRoutePath, previewPath }: { center: [number, number], origin: any, destination: any, selectedRoutePath: any, previewPath: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRoutePath && selectedRoutePath.length > 0) {
      const bounds = L.latLngBounds(selectedRoutePath);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (previewPath && previewPath.length > 0) {
      const bounds = L.latLngBounds(previewPath);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, map.getZoom());
    }
  }, [center, origin, destination, selectedRoutePath, previewPath, map]);
  
  return null;
}

const TransportMap = ({ center, origin, destination, selectedRoutePath, previewPath, pathColor = "#10b981", isPublicTransport, onMapClick }: TransportMapProps) => {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center as L.LatLngExpression} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <ChangeView center={center} origin={origin} destination={destination} selectedRoutePath={selectedRoutePath} previewPath={previewPath} />
        <MapEvents onMapClick={onMapClick} />
        
        {origin && (
          <Marker position={origin as L.LatLngExpression} icon={OriginIcon}>
            <Popup>Départ</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination as L.LatLngExpression} icon={DestinationIcon}>
            <Popup>Arrivée</Popup>
          </Marker>
        )}

        {/* Selected Route */}
        {selectedRoutePath && (
          <>
            <Polyline 
              positions={selectedRoutePath} 
              color={pathColor} 
              weight={isPublicTransport ? 10 : 6} 
              opacity={0.8}
              lineJoin="round"
            />
            {isPublicTransport && (
              <Polyline 
                positions={selectedRoutePath} 
                color="white" 
                weight={2} 
                opacity={0.6}
                dashArray="10, 10"
                lineJoin="round"
              />
            )}
          </>
        )}

        {/* Preview Route (Dashed, following roads) */}
        {origin && destination && !selectedRoutePath && previewPath && (
          <Polyline 
            positions={previewPath} 
            color="#10b981" 
            weight={4} 
            opacity={0.8} 
            dashArray="12, 12"
          />
        )}

        {/* Fallback straight line if preview path isn't loaded yet */}
        {origin && destination && !selectedRoutePath && !previewPath && (
          <Polyline 
            positions={[origin, destination]} 
            color="#10b981" 
            weight={4} 
            opacity={0.4} 
            dashArray="12, 12"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TransportMap;