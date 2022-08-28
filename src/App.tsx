import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from "react";
import { getRandomColor } from "./utils/getRandomColor";
import * as areas from "./areas";
import * as districts from "./districts";
import { filterDistricts } from "./utils/filterGeoData";

// @ts-ignore

const center = [0.557299, 50.857839];

function App() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  // const [zoom, setZoom] = useState<[number]>([6]);
  const [filteredDistricts, setFilteredDistricts] = useState<any>(["tn"]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [renderedDistricts, setRenderedDistricts] = useState<string[]>([]);

  const applyAreas = () => {
    Object.keys(areas).forEach((area: string) => {
      // @ts-ignore
      areas[area].features.forEach((item) => {
        if (map.current.getSource(area)) return;
        map.current.addSource(area, {
          type: "geojson",
          // @ts-ignore
          data: item,
        });

        map.current.addLayer({
          id: `${area}-layer`,
          type: "fill",
          source: area,
          tolerance: 0,
          paint: {
            "fill-color": getRandomColor(),
            "fill-opacity": 0.4,
            "fill-antialias": true,
            "fill-outline-color": "black",
          },
        });
      });
    });
  };

  const applyDistricts = () => {
    filteredDistricts.forEach((district: string) => {
      // @ts-ignore
      // Add pertinent layers
      districts[district].features.forEach((item: any, index: any) => {
        if (map.current.getSource(`${district}-${index}`)) return;
        const currentlyRendered = [...renderedDistricts];
        currentlyRendered.push(`${district}-${index}`);
        setRenderedDistricts(currentlyRendered);
        map.current.addSource(`${district}-${index}`, {
          type: "geojson",
          data: item,
        });

        map.current.addLayer({
          id: `${district}-layer-${index}`,
          type: "fill",
          source: `${district}-${index}`,
          minzoom: 9,
          maxzoom: 15,
          tolerance: 0,
          paint: {
            "fill-color": getRandomColor(),
            "fill-opacity": 0.4,
            "fill-antialias": true,
            "fill-outline-color": "black",
          },
        });
      });
    });
  };

  const handleOnZoom = (zoom: any) => {
    if (zoom < 9) {
      renderedDistricts.forEach((district: any) => {
        return map.current.removeLayer(district);
      });
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: [8],
      maxZoom: 14,
      center,
    });

    map.current.on("moveend", (e: any) => {
      if (e.target.transform.tileZoom < 9) return;
      setFilteredDistricts(filterDistricts(e.target.transform._center));
    });

    map.current.on("load", () => setMapLoaded(true));

    map.current.on("zoom", (e: any) =>
      handleOnZoom(e.target.transform.tileZoom)
    );
  });

  console.log(mapLoaded);

  useEffect(() => {
    if (!mapLoaded) return;
    applyAreas();
    applyDistricts();
  }, [mapLoaded, filteredDistricts]);

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
