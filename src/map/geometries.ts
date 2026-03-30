import maplibregl from "maplibre-gl";

export const addGeometries = async (map: maplibregl.Map) => {
  await addPoint(map);
  await addRoute(map);
  await addPolygon(map);

  addInteractions(map);
};

// Point
const addPoint = async (map: maplibregl.Map) => {
  map.addSource("point", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [85.3117, 27.7006],
      },
      properties: { name: "Dharahara" },
    },
  });

  map.addLayer({
    id: "point-layer",
    type: "circle",
    source: "point",
    paint: {
      "circle-radius": 10,
      "circle-color": "#e63946",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
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
  
  const interactiveLayers = ["point-layer", "route-layer", "kathmandu-fill"];

  // Click Popup
  map.on("click", (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: interactiveLayers,
    });

    if (!features.length) return;

    const feature =
      features.find((f) => f.layer.id === "point-layer") ||
      features.find((f) => f.layer.id === "route-layer") ||
      features.find((f) => f.layer.id === "kathmandu-fill");

    if (!feature) return;

    const name = feature.properties?.name;

    new maplibregl.Popup()
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