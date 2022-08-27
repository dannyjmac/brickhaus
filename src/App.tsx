import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from "react";
import { getRandomColor } from "./utils/getRandomColor";
import * as regions from "./regions";

const center = [0.557299, 50.857839];

function App() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  const [zoom, setZoom] = useState<[number]>([10]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom,
      center,
    });

    map.current.on("zoom", (e: any) => setZoom(e.target.transform.tileZoom));

    map.current.on("load", function () {
      Object.keys(regions as any).forEach((region: string) => {
        // @ts-ignore
        regions[region].features.forEach((item: any, index: any) => {
          map.current.addSource(`${region}-${index}`, {
            type: "geojson",
            data: item,
          });

          // map.current.addLayer({
          //   id: `${region}-label-${index}`,
          //   type: "symbol",
          //   source: `${region}-${index}`,
          //   // filter: ["<=", ["distance-from-center"], 0.5],
          //   minzoom: 9,
          //   // tolerance: 0.1,
          //   layout: {
          //     "text-field": ["get", "name"],
          //     "text-variable-anchor": ["top", "bottom", "left", "right"],
          //     "text-radial-offset": 0.5,
          //     "text-justify": "auto",
          //     "icon-image": ["get", "icon"],
          //   },
          // });

          map.current.addLayer({
            id: `${region}-layer-${index}`,
            type: "fill",
            source: `${region}-${index}`,
            minzoom: 8,
            tolerance: 3,
            // filter: [">=", ["distance-from-center"], 300],
            paint: {
              "fill-color": getRandomColor(),
              "fill-opacity": 0.4,
              "fill-antialias": true,
              "fill-outline-color": "black",
            },
          });
        });
      });
    });
  });
  return <div style={{ height: "100vh", width: "100vw" }} ref={mapContainer} />;
}

export default App;
