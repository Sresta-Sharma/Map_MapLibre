# MapLibre Interactive Map

A modern interactive web map built using **MapLibre GL JS** showcasing real-world geospatial features of Kathmandu with smooth interactions.

---

## Features

- **Marker (Dharahara)**
  - Custom colored marker
  - Click to view popup
  - Smooth zoom on click

- **Route Visualization**
  - GeoJSON-based LineString
  - Highlight on click
  - Auto zoom to route bounds

- **Kathmandu Polygon**
  - District boundary visualization
  - Highlight effect on click
  - Zoom to area

- **Interactive Experience**
  - Click-based popups
  - Feature highlighting
  - Clean UI

- **Basemap Switcher**
  - Light & Dark themes

---

## Project Structure

```
src/
│
├── components/
│   ├── MapBasic.tsx
│   └── LayerSwitcher.tsx
│
├── map/
│   ├── geometries.ts
│   └── mapStyles.ts
│
public/
└── data/
    ├── route.geojson
    └── kathmandu.geojson
```

---

## Tech Stack

- React (TypeScript)
- MapLibre GL JS
- Tailwind CSS
- GeoJSON

---

## Setup & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open in browser:
```
http://localhost:5173
```

---

## Map Data

- Marker: Dharahara  
- Route: Boudha → Baneshwor → Patan  
- Polygon: Kathmandu District  

---