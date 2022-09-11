import "mapbox-gl/dist/mapbox-gl.css";
// @ts-ignore
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import styled from "styled-components";
import { useRef, useEffect } from "react";
import { areaOpacity, postcodeLabels, fills } from "../utils/map";

const center = [-0.118092, 51.509865];

interface MapProps {
  handleDistrictClick: (district: string) => void;
}

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;

  .mapbox-improve-map {
    display: none;
  }

  .mapboxgl-ctrl-bottom-left {
    z-index: 1;
  }
`;

const Map = ({ handleDistrictClick }: MapProps) => {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/dannyjmac/cl7wa5w51008e14kbusgohndx",
      zoom: [8],
      maxZoom: 14,
      center,
    });

    let hovered: any = null;

    map.current.on("click", "postcodes", (e: any) => {
      handleDistrictClick(e.features[0].properties.district);
    });

    map.current.on("mousemove", "postcodes", (e: any) => {
      if (hovered !== null) {
        map.current.setFeatureState(
          {
            source: "composite",
            sourceLayer: "postcodes",
            id: hovered,
          },
          {
            hover: false,
          }
        );
      }
      if (e.features) {
        map.current.setFeatureState(
          {
            source: "composite",
            sourceLayer: "postcodes",
            id: e.features[0].id,
          },
          {
            hover: true,
          }
        );
        hovered = e.features[0].id;
      }
    });

    map.current.on("load", () => {
      map.current.setPaintProperty("postcodes", "fill-color", fills);
      map.current.setPaintProperty("postcodes", "fill-outline-color", "black");
      map.current.setPaintProperty("postcodes", "fill-opacity", areaOpacity);
      map.current.addLayer(postcodeLabels);
    });
  });

  return <Wrapper ref={mapContainer} />;
};

export default Map;
