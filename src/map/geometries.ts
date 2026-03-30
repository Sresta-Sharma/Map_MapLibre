import maplibregl from "maplibre-gl";

const layers = {
  route: "route-layer",
  polygonFill: "kathmandu-fill",
  polygonOutline: "kathmandu-outline",
};

const defaultStyle = {
  route: { color: "#457b9d", width: 4 },
  polygon: { opacity: 0.25, outlineWidth: 2 },
};

const highlightStyle = {
  route: { color: "#1d3557", width: 6 },
  polygon: { opacity: 0.5, outlineWidth: 4 },
};

const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
  offset: [0, -30],
});

const showPopup = (
  map: maplibregl.Map,
  lngLat: maplibregl.LngLatLike,
  html: string
) => {
  popup.remove();
  popup.setLngLat(lngLat).setHTML(html).addTo(map);
};

export const addGeometries = async (map: maplibregl.Map) => {
  await addPoint(map);
  await addRoute(map);
  await addPolygon(map);

  addInteractions(map);
};

// Point
const addPoint = async (map: maplibregl.Map) => {
  const coordinates: [number, number] = [85.3119, 27.7007];

  const marker = new maplibregl.Marker({ color: "#e63946" })
    .setLngLat(coordinates)
    .addTo(map);

  const el = marker.getElement();

  el.style.cursor = "pointer";

  el.addEventListener("click", () => {
    resetHighlight(map);

    // Highlight marker
    el.style.transform = "scale(1.5)";

    // Popup
    showPopup(map, coordinates, "<strong>Dharahara</strong>");

    // Zoom
      map.flyTo({
      center: coordinates,
      zoom: 14,
      speed: 1.2,
    });
  });
};

// Route
const addRoute = async (map: maplibregl.Map) => {
  const data = await fetchGeoJSON("/data/route.geojson");

  map.addSource("route", {
    type: "geojson",
    data,
  });

  map.addLayer({
    id: layers.route,
    type: "line",
    source: "route",
    paint: {
      "line-color": defaultStyle.route.color,
      "line-width": defaultStyle.route.width,
    },
  });
};

// Polygon
const addPolygon = async (map: maplibregl.Map) => {
  const data = await fetchGeoJSON("/data/kathmandu.geojson");

  map.addSource("kathmandu", {
    type: "geojson",
    data,
  });

  map.addLayer({
    id: layers.polygonFill,
    type: "fill",
    source: "kathmandu",
    paint: {
      "fill-color": "#2a9d8f",
      "fill-opacity": defaultStyle.polygon.opacity,
    },
  });

  map.addLayer({
    id: layers.polygonOutline,
    type: "line",
    source: "kathmandu",
    paint: {
      "line-color": "#2a9d8f",
      "line-width": defaultStyle.polygon.outlineWidth,
    },
  });
};

const fetchGeoJSON = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
};

// Reset styles
const resetHighlight = (map: maplibregl.Map) => {
  
  // Route
  if (map.getLayer(layers.route)) {
    map.setPaintProperty(layers.route, "line-width", defaultStyle.route.width);
    map.setPaintProperty(layers.route, "line-color", defaultStyle.route.color);
  }

  // Polygon
  if (map.getLayer(layers.polygonFill)) {
    map.setPaintProperty(layers.polygonFill, "fill-opacity", defaultStyle.polygon.opacity);
  }

  if (map.getLayer(layers.polygonOutline)) {
    map.setPaintProperty(layers.polygonOutline, "line-width", defaultStyle.polygon.outlineWidth);
  }

  // Marker
  document.querySelectorAll(".maplibregl-marker").forEach((el) => {
    (el as HTMLElement).style.transform = "scale(1)";
  });
};

// Interactions
const addInteractions = (map: maplibregl.Map) => {
  
  const interactiveLayers = [layers.route, layers.polygonFill];

  // Click Popup
  map.on("click", (e) => {
    const target = e.originalEvent.target as HTMLElement;

    if (target.closest(".maplibregl-marker")) {
      return; // ignore marker click
    }
    
    const features = map.queryRenderedFeatures(e.point, {
      layers: interactiveLayers,
    });

    if (!features.length) {
      resetHighlight(map);
      popup.remove(); // close popup
      return;
    }

    const feature =
      features.find((f) => f.layer.id === layers.route) ||
      features.find((f) => f.layer.id === layers.polygonFill);

    if (!feature) return;

    resetHighlight(map);

    const name = feature.properties?.name;

    // Route
    if (feature.layer.id === layers.route) {
      map.setPaintProperty(layers.route, "line-width", highlightStyle.route.width);
      map.setPaintProperty(layers.route, "line-color", highlightStyle.route.color);

      const coords = (feature.geometry as any).coordinates;
      zoomToBounds(map, coords);
    }

    // Polygon
    if (feature.layer.id === layers.polygonFill) {
      map.setPaintProperty(layers.polygonFill, "fill-opacity", highlightStyle.polygon.opacity);
      map.setPaintProperty(layers.polygonOutline, "line-width", highlightStyle.polygon.outlineWidth);

      const coords = (feature.geometry as any).coordinates[0];
      zoomToBounds(map, coords);
    }

    showPopup(map, e.lngLat, `<strong>${name}</strong>`);
  });

  // Cursor Pointer
  interactiveLayers.forEach((layer) => {
    map.on("mouseenter", layer, () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", layer, () => {
      map.getCanvas().style.cursor = "";
    });
  });
};

const zoomToBounds = (map: maplibregl.Map, coordinates: number[][]) => {
  const bounds = coordinates.reduce(
    (b, coord) => b.extend(coord as [number, number]),
    new maplibregl.LngLatBounds(
      coordinates[0] as [number, number], 
      coordinates[0] as [number, number]
    )
  );

  map.fitBounds(bounds, {
    padding: 40,
    duration: 1000,
  });
};