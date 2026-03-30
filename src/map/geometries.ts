import maplibregl from "maplibre-gl";

export const addGeometries = async (map: maplibregl.Map) => {
  await addPoint(map);
  await addRoute(map);
  await addPolygon(map);

  addInteractions(map);
};

const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
});

// Point
const addPoint = async (map: maplibregl.Map) => {
  const coordinates: [number, number] = [85.3117, 27.7006];

  const marker = new maplibregl.Marker({ color: "#e63946" })
    .setLngLat(coordinates)
    .addTo(map);

  const el = marker.getElement();

  el.style.cursor = "pointer";

  el.addEventListener("click", () => {
    popup
      .setLngLat(coordinates)
      .setOffset([0, -30])
      .setHTML("<strong>Dharahara</strong>")
      .addTo(map);
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
    id: "route-layer",
    type: "line",
    source: "route",
    paint: {
      "line-color": "#457b9d",
      "line-width": 4,
      "line-opacity": 0.9,
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
    id: "kathmandu-fill",
    type: "fill",
    source: "kathmandu",
    paint: {
      "fill-color": "#2a9d8f",
      "fill-opacity": 0.25,
    },
  });

  map.addLayer({
    id: "kathmandu-outline",
    type: "line",
    source: "kathmandu",
    paint: {
      "line-color": "#2a9d8f",
      "line-width": 2,
    },
  });
};

const fetchGeoJSON = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

// Interactions
const addInteractions = (map: maplibregl.Map) => {
  
  const interactiveLayers = ["route-layer", "kathmandu-fill"];

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
      popup.remove(); // close popup
      return;
    }

    const feature =
      features.find((f) => f.layer.id === "route-layer") ||
      features.find((f) => f.layer.id === "kathmandu-fill");

    if (!feature) return;

    const name = feature.properties?.name;

    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong>`)
      .addTo(map);
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