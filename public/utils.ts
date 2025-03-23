import { Overrides } from "./types";

export const distinct = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

export const roundTwoDecimals = (x: number) => Math.round(x * 100) / 100;

export const luma = (colorHex: string): number | undefined => {
  if (!doesStrLookLikeColor(colorHex)) {
    console.error("Invalid color hex", colorHex);
    return undefined;
  }

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let hex = colorHex.slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const doesStrLookLikeColor = (str: string): boolean => {
  const regex =
    /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$|^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*((0(?:\.\d+)?|1(?:\.0)?)))?\)$/i;
  return regex.test(str);
};

export const isValidJSON = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const pickRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const generateRangeFromStep = (
  start: number,
  end: number,
  step: number
): number[] => {
  if (step <= 0) {
    throw new Error("Step must be greater than 0");
  }
  if (start > end && step > 0) {
    throw new Error("Start cannot be greater than end when step is positive");
  }

  const returnArray: number[] = [];
  let track = start;
  while (track <= end) {
    returnArray.push(track);
    track = roundTwoDecimals(track + step);
  }

  return returnArray;
};

export const deepCopy = <T>(object: T): T => {
  return JSON.parse(JSON.stringify(object));
};

export const override = (obj: Overrides, overrides?: Overrides) => {
  if (!overrides || !obj) {
    return;
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (
      typeof value === "boolean" ||
      typeof value === "string" ||
      typeof value === "number" ||
      Array.isArray(value)
    ) {
      obj[key] = value;
    } else {
      // @ts-expect-error idk theres an error
      override(obj[key], value);
    }
  }
};

export const getCurrentTimestampAsString = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};
