import * as regions from "../regions";
import { getDistance } from "geolib";
import center from "@turf/center";

const allCenters = Object.keys(regions).map((key) => {
  // @ts-ignore
  return { key, coordinates: center(regions[key]).geometry.coordinates };
});

export const filterRegions = (c: any) => {
  const filtered = allCenters.filter((region) => {
    const distance = getDistance(
      { latitude: c.lat, longitude: c.lng },
      { latitude: region.coordinates[1], longitude: region.coordinates[0] }
    );

    if (distance < 80000) return true;
  });

  return filtered.map((r) => r.key);
};
