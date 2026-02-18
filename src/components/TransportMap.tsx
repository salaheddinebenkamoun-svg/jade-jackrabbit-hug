"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const OriginIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #00d66b; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const DestinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ff3b30; width: 20px; height: 20px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface TransportMapProps {
  center: [number, number];
  origin: [number, number] | null;
  destination: [number, number] | null;
  selectedRoutePath: [number, number][] | null;
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

function ChangeView({ center, origin, destination, selectedRoutePath }: { center: [number, number], origin: any, destination: any, selectedRoutePath: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedRoutePath && selectedRoutePath.length > 0) {
      const bounds = L.latLngBounds(selectedRoutePath);
      map.fitBounds(bounds, { padding: [100, 100] });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [100, 100] });
    } else {
      map.setView(center, map.getZoom());
    }
  }, [center, origin, destination, selectedRoutePath, map]);
  
  return null;
}

const TransportMap = ({ center, origin, destination, selectedRoutePath, onMapClick }: TransportMapProps) => {
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
        <ChangeView center={center} origin={origin} destination={destination} selectedRoutePath={selectedRoutePath} />
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

        {selectedRoutePath && (
          <Polyline 
            positions={selectedRoutePath} 
            color="#00d66b" 
            weight={8} 
            opacity={0.9}
            lineJoin="round"
          />
        )}

        {origin && destination && !selectedRoutePath && (
          <Polyline 
            positions={[origin, destination]} 
            color="#94a3b8" 
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