import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect } from "react";
import data from "./TN.json";

const home = [0.557299, 50.857839];

function App() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);

  const randomColor = () => {
    return (
      "hsl(" +
      360 * Math.random() +
      "," +
      (25 + 70 * Math.random()) +
      "%," +
      (50 + 10 * Math.random()) +
      "%)"
    );
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 12,
      center: home,
    });

    map.current.on("load", function () {
      data.features.forEach((item, index) => {
        console.log({ item });
        map.current.addSource(`tn-${index}`, {
          type: "geojson",
          data: item,
        });

        map.current.addLayer({
          id: `tn-label-${index}`,
          type: "symbol",
          source: `tn-${index}`,
          layout: {
            "text-field": ["get", "name"],
            "text-variable-anchor": ["top", "bottom", "left", "right"],
            "text-radial-offset": 0.5,
            "text-justify": "auto",
            "icon-image": ["get", "icon"],
          },
        });

        map.current.addLayer({
          id: `tn-layer-${index}`,
          type: "fill",
          source: `tn-${index}`,
          paint: {
            "fill-color": randomColor(),
            "fill-opacity": 0.4,
            "fill-antialias": true,
            "fill-outline-color": "black",
          },
        });
      });
    });
  });
  return <div style={{ height: "100vh", width: "100vw" }} ref={mapContainer} />;
}

export default App;
