"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const OriginIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const DestinationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TransportMapProps {
  center: [number, number];
  origin: [number, number] | null;
  destination: [number, number] | null;
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

function ChangeView({ center, origin, destination }: { center: [number, number], origin: any, destination: any }) {
  const map = useMap();
  
  useEffect(() => {
    if (origin && destination) {
      const bounds = L.latLngBounds([origin, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, map.getZoom());
    }
  }, [center, origin, destination, map]);
  
  return null;
}

const TransportMap = ({ center, origin, destination, onMapClick }: TransportMapProps) => {
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
        <ChangeView center={center} origin={origin} destination={destination} />
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

        {origin && destination && (
          <Polyline 
            positions={[origin, destination]} 
            color="#10b981" 
            weight={4} 
            opacity={0.6} 
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TransportMap;