import { create } from "zustand";
import {
  generateTeamHelmetConfigFromOverrides,
  TeamHelmetConfig,
  teamHelmetStyles,
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
        renderOptions: {
          valuesToRender: Readonly<string[]>;
        };
      }
    | {
        selectionType: "text";
      }
    | {
        selectionType: "toggle";
      }
  ))[] = [
  {
    key: "flipHelmet",
    text: "Flip Helmet",
    selectionType: "toggle",
  },
  {
    key: "helmetStyle",
    text: "Helmet Style",
    selectionType: "options",
    renderOptions: {
      valuesToRender: teamHelmetStyles,
    },
  },
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
    key: "disableLogo",
    text: "Disable Logo",
    selectionType: "toggle",
  },
  {
    key: "helmetLogoUrl",
    text: "Helmet Logo URL",
    selectionType: "text",
  },
  {
    key: "flipLogoWithHelmet",
    text: "Flip Logo With Helmet",
    selectionType: "toggle",
  },
  {
    key: "useFlippedLogoUrlWhenFlipped",
    text: "Use Flipped Logo URL When Flipped",
    selectionType: "toggle",
  },
  {
    key: "flippedHelmetLogoUrl",
    text: "Flipped Helmet Logo URL",
    selectionType: "text",
  },
  {
    key: "helmetLogoScale",
    text: "Helmet Logo Scale",
    selectionType: "range",
    renderOptions: {
      rangeConfig: {
        min: 0.5,
        max: 2,
      },
    },
  },
  {
    key: "xAdjust",
    text: "Logo X Adjust",
    selectionType: "range",
    renderOptions: {
      rangeConfig: {
        min: -100,
        max: 100,
      },
    },
  },
  {
    key: "yAdjust",
    text: "Logo Y Adjust",
    selectionType: "range",
    renderOptions: {
      rangeConfig: {
        min: -100,
        max: 100,
      },
    },
  },
  {
    key: "tigerStripeColor",
    text: "Tiger Stripe Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
  },
  {
    key: "wingColor",
    text: "Wing Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
  },
  {
    key: "hornColor",
    text: "Horn Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
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
        selectedValue: rangeConfig.min,
      };
    } else if (gallerySectionConfig.selectionType === "color") {
      return {
        ...gallerySectionConfig,
        selectedValue: "???",
      };
    } else if (gallerySectionConfig.selectionType === "colors") {
      return {
        ...gallerySectionConfig,
        selectedValue: Array(
          gallerySectionConfig.renderOptions.colorCount
        ).fill("#000000"),
      };
    } else if (gallerySectionConfig.selectionType === "options") {
      return {
        ...gallerySectionConfig,
        // selectedValue: gallerySectionConfig.renderOptions.valuesToRender[0],
        selectedValue: gallerySectionConfig.renderOptions.valuesToRender[0],
      };
    } else if (gallerySectionConfig.selectionType === "text") {
      return {
        ...gallerySectionConfig,
        selectedValue: "",
      };
    } else if (gallerySectionConfig.selectionType === "toggle") {
      return {
        ...gallerySectionConfig,
        selectedValue: false,
      };
    } else {
      return gallerySectionConfig;
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

const generateInitialHelmetConfig = () => {
  let helmetConfig: TeamHelmetConfig;
  if (location.hash.length <= 1) {
    helmetConfig = generateTeamHelmetConfigFromOverrides({
      teamHelmetConfigOverrides: {
        helmetColor: "#f00",
        facemaskColor: "#fff",
      },
    });
  } else {
    try {
      helmetConfig = JSON.parse(atob(location.hash.slice(1)));
    } catch (error) {
      console.error(error);
      helmetConfig = generateTeamHelmetConfigFromOverrides({
        teamHelmetConfigOverrides: {
          helmetColor: "#f00",
          facemaskColor: "#fff",
        },
      });
    }
  }
  return helmetConfig;
};

const initialHelmetConfig = generateInitialHelmetConfig();
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
