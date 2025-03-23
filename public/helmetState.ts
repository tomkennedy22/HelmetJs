import { create } from "zustand";
import {
  generateTeamHelmetConfigFromOverrides,
  TeamHelmetConfig,
} from "../src";
import {
  CombinedState,
  GallerySectionConfig,
  GallerySize,
  OverrideListItem,
  Overrides,
} from "./types";
import { getProperty, setProperty } from "dot-prop";
import { generateRangeFromStep, roundTwoDecimals } from "./utils";

const gallerySectionInfos: (Pick<
  GallerySectionConfig,
  "key" | "text" | "isSelected"
> &
  (
    | {
        selectionType: "color";
        colorFormat: "rgba" | "hex";
        renderOptions: {
          valuesToRender: string[];
        };
      }
    | {
        selectionType: "colors";
        colorFormat: "rgba" | "hex";
        renderOptions: {
          colorCount: number;
          valuesToRender: string[][];
        };
      }
    | {
        selectionType: "range";
        renderOptions: {
          rangeConfig: {
            min: number;
            max: number;
          };
        };
      }
    | {
        selectionType: "options";
      }
  ))[] = [
  {
    key: "helmetColor",
    text: "Helmet Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
  },
  {
    key: "facemaskColor",
    text: "Facemask Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
  },
  {
    key: "helmetLogoScale",
    text: "helmetLogoScale",
    selectionType: "range",
    renderOptions: {
      rangeConfig: {
        min: 0.5,
        max: 2,
      },
    },
  },
];

const gallerySectionConfigList: GallerySectionConfig[] =
  gallerySectionInfos.map((gallerySectionConfig) => {
    if (gallerySectionConfig.selectionType === "range") {
      const rangeConfig = gallerySectionConfig.renderOptions.rangeConfig;

      const range = rangeConfig.max - rangeConfig.min;
      const step = roundTwoDecimals(range / 4);
      const sliderStep = Math.max(roundTwoDecimals(range / 35), 0.01);

      const valuesToRender = generateRangeFromStep(
        rangeConfig.min,
        rangeConfig.max,
        step
      );

      return {
        ...gallerySectionConfig,
        renderOptions: {
          ...gallerySectionConfig.renderOptions,
          rangeConfig: {
            ...gallerySectionConfig.renderOptions.rangeConfig,
            step,
            sliderStep,
          },
          valuesToRender,
        },
        randomizeEnabled: true,
        selectedValue: rangeConfig.min,
      };
    } else if (gallerySectionConfig.selectionType === "color") {
      return {
        ...gallerySectionConfig,
        randomizeEnabled: true,
        selectedValue: "???",
      };
    } else if (gallerySectionConfig.selectionType === "colors") {
      return {
        ...gallerySectionConfig,
        randomizeEnabled: true,
        selectedValue: Array(
          gallerySectionConfig.renderOptions.colorCount
        ).fill("#000000"),
      };
    } else {
      return {
        ...gallerySectionConfig,
        randomizeEnabled: true,
        selectedValue: "???",
      };
    }
  });

const applyValuesToGallerySectionConfigList = (
  gallerySectionConfigList: GallerySectionConfig[],
  teamHelmetConfig: TeamHelmetConfig
) => {
  for (const row of gallerySectionConfigList) {
    row.selectedValue = getProperty(teamHelmetConfig, row.key);
  }
};

const updateUrlHash = (teamHelmetConfig: TeamHelmetConfig) => {
  history.replaceState(
    undefined,
    "",
    `#${btoa(JSON.stringify(teamHelmetConfig))}`
  );
};

const initialHelmetConfig = generateTeamHelmetConfigFromOverrides({
  teamHelmetConfigOverrides: {
    helmetColor: "#f00",
    facemaskColor: "#fff",
  },
});
applyValuesToGallerySectionConfigList(
  gallerySectionConfigList,
  initialHelmetConfig
);
updateUrlHash(initialHelmetConfig);

export const useHelmetStore = create<CombinedState>()((set) => ({
  teamHelmetConfig: initialHelmetConfig,
  setTeamHelmetConfig: (teamHelmetConfig) =>
    set((state: CombinedState) => {
      history.replaceState(
        undefined,
        "",
        `#${btoa(JSON.stringify(teamHelmetConfig))}`
      );

      applyValuesToGallerySectionConfigList(
        gallerySectionConfigList,
        teamHelmetConfig
      );
      updateUrlHash(teamHelmetConfig);

      return {
        ...state,
        gallerySectionConfigList: [...gallerySectionConfigList],
        teamHelmetConfig: { ...teamHelmetConfig },
      };
    }),
  gallerySectionConfigList,
  gallerySize: "sm",
  setGallerySize: (size: GallerySize) =>
    set((state: CombinedState) => {
      return { ...state, gallerySize: size };
    }),
}));

export const getOverrideListForItem = (
  gallerySectionConfig: GallerySectionConfig
) => {
  const overrideList: OverrideListItem[] = [];

  if (
    gallerySectionConfig.selectionType === "range" ||
    gallerySectionConfig.selectionType === "color" ||
    gallerySectionConfig.selectionType === "colors"
  ) {
    for (
      let i = 0;
      i < gallerySectionConfig.renderOptions.valuesToRender.length;
      i++
    ) {
      const valueToRender =
        gallerySectionConfig.renderOptions.valuesToRender[i];
      const overrides: Overrides = setProperty(
        {},
        gallerySectionConfig.key,
        valueToRender
      ) as Overrides;
      overrideList.push({
        override: overrides,
        value: valueToRender,
      });
    }
  }

  return overrideList;
};
