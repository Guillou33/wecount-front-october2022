import { getHashNumber } from "@lib/utils/hashNumber";
import { sampler } from "./sampler";

const getHashColor = (seed: string): string => {
  const hashNumber = getHashNumber(seed);

  return COLORS[hashNumber % COLORS.length];
};

export { getHashColor };

export enum Color {
  ORIGIN,
  BLUE,
  GREEN,
  ORANGE,
  FLAT_UI,
  PASTEL,
  EMISSION_BLUE,
  PROJECTION_PURPLE,
  BLUDOUGH
}

const COLORS = [
  "#1b2668",
  "#5ef1d5",
  "#2e86ab",
  "#f0a202",
  "#f18805",
  "#A1E5AB",
  "#475841",
  "#FF87AB ",
  "#710627",
  "#DDF9C1",
  "#EFC7C2",
  "#4E5340",
  "#96616B",
  "#37505C",
  "#C1666B",
  "#731DD8",
  "#48A9A6",
  "#D4B483",
];

const palettes: { [key in Color]: string[] } = {
  [Color.ORIGIN]: COLORS,
  [Color.BLUE]: [
    "#B6D1FF",
    "#9DB6EF",
    "#839BE0",
    "#6A80D0",
    "#5065C0",
    "#374AB1",
    "#1D2FA1",
  ],
  [Color.GREEN]: [
    "#ADE6C4",
    "#92CFA7",
    "#77B889",
    "#5CA16C",
    "#408A4F",
    "#257331",
    "#0A5C14",
  ],
  [Color.ORANGE]: [
    "#EED991",
    "#EAC379",
    "#E5AD61",
    "#E19749",
    "#DC8030",
    "#D86A18",
    "#D35400",
  ],
  [Color.BLUDOUGH]: [
    '#1B2769',
    '#1F417F',
    '#23528A',
    '#2E79A1',
    '#43A6B7',
    '#67CDC7',
    '#9FE4D1',
    //'#E6FAF1',
    '#FFE570',
    '#FFD000',
    '#FFB700',
    '#FFA200',
    '#FF8800',
    '#F57600',
  ],
  [Color.FLAT_UI]: [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
  ],
  [Color.PASTEL]: [
    "#b3eeff",
    "#9ff2e8",
    "#e9d7fe",
    "#ffdadc",
    "#fff7ab",
    "#d7f7ce",
    "#ffd7c3",
    "#b3d3ff",
    "#ffddfd",
    "#d8e3ff",
  ],
  [Color.EMISSION_BLUE]: [
    "#e6faf1",
    "#c1efde",
    "#9fe4d1",
    "#80d8ca",
    "#67cdc7",
    "#53bdc2",
    "#43a6b7",
    "#378fac",
    "#2e79a1",
    "#286596",
    "#23528a",
    "#1f417f",
    "#1d3374",
    "#1b2769",
  ],
  [Color.PROJECTION_PURPLE]: [
    "#f6ebfa",
    "#e2c7ea",
    "#cfa6da",
    "#bd88ca",
    "#ab6fba",
    "#9b5aaa",
    "#8b499a",
    "#7c3a8b",
    "#6d2f7b",
    "#5f256b",
    "#501d5b",
    "#42164b",
    "#34103b",
    "#26102b",
  ]
};

export function getSomeColor(color: Color) {
  const palette = palettes[color];
  return (seed: string) => palette[getHashNumber(seed) % palette.length];
}
export function getSomeBlue(seed: string) {
  return getSomeColor(Color.BLUE)(seed);
}

export function getSomeGreen(seed: string) {
  return getSomeColor(Color.GREEN)(seed);
}

export function getSomeOrange(seed: string) {
  return getSomeColor(Color.ORANGE)(seed);
}

export function getSomePastel(seed: string) {
  return getSomeColor(Color.PASTEL)(seed);
}

export function* browsePalette(color: Color): Generator<string, never, undefined> {
  const paletteToBrowse = palettes[color];
  while (true) {
    yield* paletteToBrowse;
  }
}

export function colorSelectorBuilder(
  minimum: number,
  maximum: number,
  color: Color
) {
  const palette = palettes[color];
  const getSample = sampler({ minimum, maximum, size: palette.length });

  return (value: number) => {
    const colorIndex = getSample(value);
    return palette[colorIndex];
  };
}

export function getPalette(color: Color) {
  return palettes[color];
}

export function needsWhiteTextToContrast(color: string): boolean {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 <= 186;
}
