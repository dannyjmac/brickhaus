import * as districts from "../districts";
import { getDistance } from "geolib";
import center from "@turf/center";

const allCenters = Object.keys(districts).map((key) => {
  // @ts-ignore
  return { key, coordinates: center(districts[key]).geometry.coordinates };
});

export const filterDistricts = (c: any) => {
  const filtered = allCenters.filter((district) => {
    const distance = getDistance(
      { latitude: c.lat, longitude: c.lng },
      { latitude: district.coordinates[1], longitude: district.coordinates[0] }
    );
    if (distance < 40000) return true;
  });

  return filtered.map((r) => r.key);
};
