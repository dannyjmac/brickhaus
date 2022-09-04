import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useEffect, useState } from "react";
import { getRandomColor } from "./utils/getRandomColor";
import * as areas from "./areas";
import * as districts from "./districts";
import { filterDistricts } from "./utils/filterGeoData";

const center = [-0.118092, 51.509865];

function App() {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  const [filteredDistricts, setFilteredDistricts] = useState<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [activeDistrict, setActiveDistrict] = useState<any>("");

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
          minzoom: 2,
          // maxzoom: 10,
          paint: {
            "fill-color": getRandomColor(),
            "fill-opacity": 0.5,
            "fill-antialias": true,
            "fill-outline-color": "black",
          },
        });

        map.current.on("mouseenter", `${area}-layer`, (e: any) => {
          map.current.setPaintProperty(`${area}-layer`, "fill-opacity", 0.6);
        });

        map.current.on("mouseleave", `${area}-layer`, () => {
          map.current.setPaintProperty(`${area}-layer`, "fill-opacity", 0.3);
        });

        map.current.on("click", `${area}-layer`, async () => {
          Object.keys(areas).forEach((area2: string) => {
            if (area2 !== area) {
              map.current.setLayoutProperty(
                `${area2}-layer`,
                "visibility",
                "visible"
              );
            }
          });

          await map.current.setLayoutProperty(
            `${area}-layer`,
            "visibility",
            "none"
          );
          applyDistricts(area);
        });
      });
    });
  };

  const applyDistricts = (area: string) => {
    if (map.current.getSource(`tn-1`)) {
      console.log("found one");
    }

    Object.keys(areas).forEach((currentArea) => {
      // @ts-ignore
      if (districts[currentArea]?.features) {
        // @ts-ignore
        districts[currentArea].features.forEach((item: any, index: any) => {
          if (map.current.getSource(`${currentArea}-${index}`)) {
            map.current.removeLayer(`${currentArea}-layer-${index}`);
            map.current.removeSource(`${currentArea}-${index}`);
          }
        });
      }
    });

    // @ts-ignore
    districts[area].features.forEach((item: any, index: any) => {
      if (map.current.getSource(`${area}-${index}`)) return;
      map.current.addSource(`${area}-${index}`, {
        type: "geojson",
        data: item,
      });
      map.current.addLayer({
        id: `${area}-layer-${index}`,
        type: "fill",
        source: `${area}-${index}`,
        tolerance: 0,
        paint: {
          "fill-color": getRandomColor(),
          "fill-opacity": 0.4,
          "fill-antialias": true,
          "fill-outline-color": "black",
        },
      });
    });

    setActiveDistrict(area);
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

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Use for cleaning up districts
    // map.current.on("zoom", (e: any) =>
    //   handleOnZoom(e.target.transform.tileZoom)
    // );
  });

  useEffect(() => {
    if (!mapLoaded) return;
    applyAreas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
