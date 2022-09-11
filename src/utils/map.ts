export const text = {
  "text-field": [
    "format",
    ["upcase", ["get", "district"]],
    {
      "font-scale": 1,
      "text-color": "grey",
    },
  ],
  "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
};

export const areaOpacity = [
  "case",
  ["boolean", ["feature-state", "hover"], false],
  0.6,
  0.2,
];

export const postcodeLabels = {
  id: "postcode-labels",
  type: "symbol",
  source: "composite",
  "source-layer": "postcodes",
  layout: text,
};

export const fills = [
  "interpolate",
  ["linear"],
  ["get", "group"],
  0,
  "hotpink",
  10,
  "yellow",
  20,
  "orange",
  30,
  "red",
  40,
  "yellow",
  50,
  "hotpink",
  60,
  "yellow",
  70,
  "orange",
  80,
  "red",
  90,
  "yellow",
  100,
  "hotpink",
  110,
  "red",
  120,
  "orange",
];

// map.current.setPaintProperty(
//   "postcodes",
//   "fill-color",

//   [
//     "match",
//     ["get", "group"],
//     0,
//     "#fbb03b",
//     1,
//     "#223b53",
//     2,
//     "#e55e5e",
//     3,
//     "#3bb2d0",
//     /* other */ "#ccc",
//   ]
// );

// Interpolate Linear
//   "interpolate",
//   ["linear"],
//   ["get", "group"],
//   0,
//   "blue",
//   20,
//   "orange",
//   50,
//   "red",
//   90,
//   "green",
//   120,
//   "yellow",
// ]);
