import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapBasic = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const mapStyles = {
    light: "https://tiles.openfreemap.org/styles/liberty",
    dark: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
  };
  
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: mapStyles.light,
      center: [85.324, 27.7172], // Kathmandu
      zoom: 10,
    });

    // Zoom, Rotation & FullScreen controls
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current.addControl(new maplibregl.FullscreenControl(), "top-right");
  }, []);

  const changeBasemap = (styleKey: keyof typeof mapStyles) => {
    mapRef.current?.setStyle(mapStyles[styleKey]);
  };

  return (
    <div className="relative h-screen w-screen">
      
        {/* Map */}
        <div ref={mapContainer} className="h-full w-full" />

        {/* Baselayer Switcher */}
        <div className="absolute top-4 left-4 z-50">
        <select
            onChange={(e) => {
            const selected = e.target.value as "light" | "dark"; 
            changeBasemap(selected);
            }}
            className="bg-white/90 border border-gray-200 text-sm rounded-lg shadow-md px-3 py-2 cursor-pointer"
            defaultValue="light" 
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
        </div>
    </div>
  );
};

export default MapBasic;