import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from "react";
import { getRandomColor } from "./utils/getRandomColor";
import * as regions from "./regions";
import { filterRegions } from "./utils/filterGeoData";

const center = [0.557299, 50.857839];

function App() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  // const [zoom, setZoom] = useState<[number]>([6]);
  const [regionz, setRegionz] = useState<any>(["tn"]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const addSourcesLayers = (region: any, index: any, item: any) => {
    map.current.addSource(`${region}-${index}`, {
      type: "geojson",
      data: item,
    });
    map.current.addLayer({
      id: `${region}-layer-${index}`,
      type: "fill",
      source: `${region}-${index}`,
      minzoom: 9,
      tolerance: 1,
      paint: {
        "fill-color": getRandomColor(),
        "fill-opacity": 0.4,
        "fill-antialias": true,
        "fill-outline-color": "black",
      },
    });
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: [8],
      center,
    });

    map.current.on("moveend", (e: any) => {
      if (e.target.transform.tileZoom < 9) return;
      setRegionz(filterRegions(e.target.transform._center));
    });

    map.current.on("load", () => setMapLoaded(true));
  });

  useEffect(() => {
    if (!mapLoaded) return;
    regionz.forEach((region: string) => {
      // @ts-ignore
      // Add pertinent layers
      regions[region].features.forEach((item: any, index: any) => {
        if (map.current.getSource(`${region}-${index}`)) return;
        addSourcesLayers(region, index, item);
      });
    });
  }, [mapLoaded, regionz]);

  return <div style={{ height: "100vh", width: "100vw" }} ref={mapContainer} />;
}

export default App;

// map.current.addLayer({
//   id: `${region}-label-${index}`,
//   type: "symbol",
//   source: `${region}-${index}`,
//   // filter: ["<=", ["distance-from-center"], 0.5],
//   minzoom: 7,
//   // tolerance: 0.1,
//   layout: {
//     "text-field": ["get", "name"],
//     "text-variable-anchor": ["top", "bottom", "left", "right"],
//     "text-radial-offset": 0.5,
//     "text-justify": "auto",
//     "icon-image": ["get", "icon"],
//   },
// });
