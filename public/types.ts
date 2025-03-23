/* eslint-disable @typescript-eslint/no-explicit-any */
import { TeamHelmetConfig } from "../src";

export type GallerySize = "sm" | "md" | "lg";
export type ColorFormat = "hex" | "rgba";

export type HelmetState = {
  teamHelmetConfig: TeamHelmetConfig;
  setTeamHelmetConfig: (teamHelmetConfig: TeamHelmetConfig) => void;
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
  randomizeEnabled: boolean;
};

type GallerySectionConfigRange = GallerySectionConfigBase & {
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

type GallerySectionConfigColor = GallerySectionConfigBase & {
  selectionType: "color";
  selectedValue: string;
  colorFormat: ColorFormat;
  renderOptions: {
    valuesToRender: string[];
  };
};

type GallerySectionConfigColors = GallerySectionConfigBase & {
  selectionType: "colors";
  selectedValue: string[];
  colorFormat: ColorFormat;
  renderOptions: {
    colorCount: number;
    valuesToRender: string[][];
  };
};

type GallerySectionConfigOptions = GallerySectionConfigBase & {
  selectionType: "options";
  selectedValue: string;
};

export type GallerySectionConfig =
  | GallerySectionConfigRange
  | GallerySectionConfigColor
  | GallerySectionConfigColors
  | GallerySectionConfigOptions;

export type CombinedState = HelmetState & GalleryState;

export type Overrides = {
  [key: string]: boolean | string | number | any[] | Overrides;
};

export type OverrideListItem = {
  override: Overrides;
  value: string | number | string[];
};
