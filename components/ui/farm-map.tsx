'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface FarmMapProps {
  latitude?: number;
  longitude?: number;
  sizeHa?: number;
  farmName: string;
}

export function FarmMap({ latitude, longitude, sizeHa = 1, farmName }: FarmMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Dynamic import to avoid SSR issues
    import('@/lib/leaflet-config').then((module) => {
      const L = module.default;

      // Default coordinates (if not provided, use a default location)
      const lat = latitude || -1.286389; // Default to Nairobi, Kenya
      const lng = longitude || 36.817223;

      // Clean up existing map
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current!).setView([lat, lng], 15);
      mapRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Calculate radius based on farm size
      // 1 hectare = 10,000 square meters
      // For a circle: Area = π * r², so r = sqrt(Area / π)
      const areaInSquareMeters = sizeHa * 10000;
      const radius = Math.sqrt(areaInSquareMeters / Math.PI);

      // Add a circle to represent the farm
      const farmCircle = L.circle([lat, lng], {
        color: '#16a34a',
        fillColor: '#86efac',
        fillOpacity: 0.3,
        radius: radius,
        weight: 2
      }).addTo(map);

      // Add a marker at the center
      const marker = L.marker([lat, lng]).addTo(map);
      marker.bindPopup(`<b>${farmName}</b><br/>Size: ${sizeHa} hectares`).openPopup();

      // Fit map bounds to show the entire circle
      map.fitBounds(farmCircle.getBounds());
    });

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, sizeHa, farmName]);

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef}
        className="w-full h-64 rounded-md overflow-hidden border border-gray-200"
        style={{ minHeight: '256px' }}
      />
      {(!latitude || !longitude) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-md">
          <p className="text-gray-500 text-sm">No GPS coordinates available</p>
        </div>
      )}
    </div>
  );
} 