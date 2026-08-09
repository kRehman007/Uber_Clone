import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

const LiveLocation = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.209 });

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView(
      [location.lat, location.lng],
      15
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([location.lat, location.lng]).addTo(map);
    mapRef.current = map;
    markerRef.current = marker;

    const sizeTimeout = setTimeout(() => map.invalidateSize(), 200);

    return () => {
      clearTimeout(sizeTimeout);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.error(error),
          { enableHighAccuracy: true }
        );
      }
    };

    updateLocation();
    const intervalId = setInterval(updateLocation, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([location.lat, location.lng]);
      mapRef.current.panTo([location.lat, location.lng]);
    }
  }, [location]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LiveLocation;
