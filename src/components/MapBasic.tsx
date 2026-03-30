import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import mapStyles from "../map/mapStyles";
import { addGeometries } from "../map/geometries";
import LayerSwitcher from "./LayerSwitcher";

const MapBasic = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: mapStyles.light,
      center: [85.324, 27.7172], // Kathmandu
      zoom: 10,
    });

    mapRef.current = map;

    // Zoom, Rotation & FullScreen controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.FullscreenControl({
        container: wrapperRef.current!, 
      }), 
      "top-right");

    map.on("load", async () => {
      await addGeometries(map);
    });
  }, []);

  const changeBasemap = (styleKey: keyof typeof mapStyles) => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(mapStyles[styleKey]);

    // Re-add geometries after style loads
    map.once("styledata", async () => {
      await addGeometries(map);
    });
  };

  return (
    <div ref={wrapperRef} className="relative h-screen w-screen">
      
        {/* Map */}
        <div ref={mapContainer} className="h-full w-full" />

        {/* Baselayer Switcher */}
        <LayerSwitcher onChange={changeBasemap} />
    </div>
  );
};

export default MapBasic;