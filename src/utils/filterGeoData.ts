import * as districts from "../districts";
import { getDistance } from "geolib";
import center from "@turf/center";

const allCenters = Object.keys(districts).map((key) => {
  // @ts-ignore
  return { key, coordinates: center(districts[key]).geometry.coordinates };
});

// A potential algo for performance
export const filterDistricts = (c: any) => {
  console.log("called");
  const filtered = allCenters.filter((district) => {
    const distance = getDistance(
      { latitude: c.lat, longitude: c.lng },
      { latitude: district.coordinates[1], longitude: district.coordinates[0] }
    );
    if (distance < 40000) return true;
  });

  return filtered.map((r) => r.key);
};

// Todo - Other potential algorithim - get which area is currently at the centre and only show the districts for that when zoomed in
