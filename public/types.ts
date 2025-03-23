/* eslint-disable @typescript-eslint/no-explicit-any */
import { HelmetConfig } from "../src";

export type GallerySize = "sm" | "md" | "lg";
export type ColorFormat = "hex" | "rgba";

export type HelmetState = {
  helmetConfig: HelmetConfig;
  setHelmetConfig: (helmetConfig: HelmetConfig) => void;
};

export type GalleryState = {
  gallerySize: GallerySize;
  gallerySectionConfigList: GallerySectionConfig[];
  setGallerySize: (size: GallerySize) => void;
  //   lastClickedSectionIndex: number;
  //   setLastClickedSectionIndex: (index: number) => void;
  //   lastSelectedFaceIndex: number;
  //   setLastSelectedFaceIndex: (index: number) => void;
  //   setRandomizeEnabledForSection: (
  //     sectionIndex: number,
  //     enabled: boolean
  //   ) => void;
};

type GallerySectionConfigBase = {
  key: string;
  text: string;
  isSelected?: boolean;
};

export type GallerySectionConfigRange = GallerySectionConfigBase & {
  selectionType: "range";
  selectedValue: number;
  renderOptions: {
    rangeConfig: {
      min: number;
      max: number;
      step: number;
      sliderStep: number;
    };
    valuesToRender: number[];
  };
};

export type GallerySectionConfigColor = GallerySectionConfigBase & {
  selectionType: "color";
  selectedValue: string;
  colorFormat: ColorFormat;
  renderOptions: {
    valuesToRender: string[];
  };
};

export type GallerySectionConfigColors = GallerySectionConfigBase & {
  selectionType: "colors";
  selectedValue: string[];
  colorFormat: ColorFormat;
  renderOptions: {
    colorCount: number;
    valuesToRender: string[][];
  };
};

export type GallerySectionConfigText = GallerySectionConfigBase & {
  selectionType: "text";
  selectedValue: string;
};

export type GallerySectionConfigToggle = GallerySectionConfigBase & {
  selectionType: "toggle";
  selectedValue: boolean;
};

export type GallerySectionConfigOptions = GallerySectionConfigBase & {
  selectionType: "options";
  selectedValue: string;
  renderOptions: {
    valuesToRender: Readonly<string[]>;
  };
};

export type GallerySectionConfig =
  | GallerySectionConfigRange
  | GallerySectionConfigColor
  | GallerySectionConfigColors
  | GallerySectionConfigText
  | GallerySectionConfigToggle
  | GallerySectionConfigOptions;

export type CombinedState = HelmetState & GalleryState;

export type Overrides = {
  [key: string]: boolean | string | number | any[] | Overrides;
};

export type OverrideListItem = {
  override: Overrides;
  value: string | number | string[];
};
