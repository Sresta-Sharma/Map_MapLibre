import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapBasic = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
      center: [85.324, 27.7172], // Kathmandu
      zoom: 10,
    });

    // Zoom + Rotation controls
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

  }, []);

  return <div ref={mapContainer} className="w-full h-screen" />;
};

export default MapBasic;