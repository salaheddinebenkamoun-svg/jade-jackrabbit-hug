"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
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
  html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const DestinationIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hue-rotate-[140deg]' // Makes it red/pinkish
});

L.Marker.prototype.options.icon = DefaultIcon;

interface TransportMapProps {
  center: [number, number];
  origin: [number, number] | null;
  destination: [number, number] | null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

const TransportMap = ({ center, origin, destination }: TransportMapProps) => {
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
        <ChangeView center={center} />
        
        {origin && (
          <Marker position={origin as L.LatLngExpression} icon={OriginIcon}>
            <Popup>Point de départ</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination as L.LatLngExpression} icon={DestinationIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default TransportMap;