import maplibregl from "maplibre-gl";

export const addGeometries = async (map: maplibregl.Map) => {
  // Point
  map.addSource("point", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [85.3117, 27.7006], // Dharahara
      },
      properties: {
        name: "Dharahara",
      },
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

  // Line (Route)
  const routeRes = await fetch("/data/route.geojson");
  const routeData = await routeRes.json();

  
  map.addSource("route", {
    type: "geojson",
    data: routeData,
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

  // Polygon (Kathmandu)
  const polyRes = await fetch("/data/kathmandu.geojson");
  const polyData = await polyRes.json();

  map.addSource("kathmandu", {
    type: "geojson",
    data: polyData,
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
