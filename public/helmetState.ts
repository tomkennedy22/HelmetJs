import { create } from "zustand";
import {
  generateHelmetConfigFromOverrides,
  HelmetConfig,
  helmetStyles,
} from "../src";
import {
  CombinedState,
  GallerySectionConfig,
  GallerySize,
  OverrideListItem,
  Overrides,
} from "./types";
import { getProperty, setProperty } from "dot-prop";
import { roundTwoDecimals } from "./utils";

const gallerySectionInfos: (Pick<
  GallerySectionConfig,
  "key" | "text" | "isSelected" | "enableDisplayFn"
> &
  (
    | {
        selectionType: "color";
        colorFormat: "rgba" | "hex";
        defaultValue?: string;
        renderOptions: {
          valuesToRender: string[];
        };
      }
    | {
        selectionType: "colors";
        colorFormat: "rgba" | "hex";
        defaultValue?: string[];
        renderOptions: {
          colorCount: number;
          valuesToRender: string[][];
        };
      }
    | {
        selectionType: "range";
        defaultValue?: number;
        renderOptions: {
          rangeConfig: {
            min: number;
            max: number;
            numSteps?: number;
            step?: number;
          };
        };
      }
    | {
        selectionType: "options";
        defaultValue?: string;
        renderOptions: {
          valuesToRender: Readonly<string[]>;
        };
      }
    | {
        selectionType: "text";
        defaultValue?: string;
      }
    | {
        selectionType: "toggle";
        defaultValue?: boolean;
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
    key: "helmetStyle",
    text: "Helmet Style",
    selectionType: "options",
    defaultValue: "Standard",
    renderOptions: {
      valuesToRender: helmetStyles,
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
    enableDisplayFn: (helmetConfig: HelmetConfig) =>
      helmetConfig.helmetStyle === "Tiger Stripe",
  },
  {
    key: "wingColor",
    text: "Wing Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
    enableDisplayFn: (helmetConfig: HelmetConfig) =>
      helmetConfig.helmetStyle === "Wing",
  },
  {
    key: "hornColor",
    text: "Horn Color",
    selectionType: "color",
    colorFormat: "hex",
    renderOptions: {
      valuesToRender: ["#f00", "#0f0", "#00f"],
    },
    enableDisplayFn: (helmetConfig: HelmetConfig) =>
      helmetConfig.helmetStyle === "Horn",
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
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "flipHelmet",
    text: "Flip Helmet",
    selectionType: "toggle",
  },
  {
    key: "flipLogoWithHelmet",
    text: "Flip Logo With Helmet",
    selectionType: "toggle",
    defaultValue: true,
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "useFlippedLogoUrlWhenFlipped",
    text: "Use Flipped Logo URL When Flipped",
    selectionType: "toggle",
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "flippedHelmetLogoUrl",
    text: "Flipped Helmet Logo URL",
    selectionType: "text",
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "helmetLogoScale",
    text: "Helmet Logo Scale",
    selectionType: "range",
    defaultValue: 1,
    renderOptions: {
      rangeConfig: {
        min: 0.5,
        max: 2,
        step: 0.1,
      },
    },
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "xAdjust",
    text: "Logo X Adjust",
    selectionType: "range",
    defaultValue: 0,
    renderOptions: {
      rangeConfig: {
        min: -100,
        max: 100,
        step: 1,
      },
    },
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
  {
    key: "yAdjust",
    text: "Logo Y Adjust",
    selectionType: "range",
    defaultValue: 0,
    renderOptions: {
      rangeConfig: {
        min: -100,
        max: 100,
        step: 1,
      },
    },
    enableDisplayFn: (helmetConfig: HelmetConfig) => !helmetConfig.disableLogo,
  },
];

const gallerySectionConfigList: GallerySectionConfig[] =
  gallerySectionInfos.map((gallerySectionConfig) => {
    if (gallerySectionConfig.selectionType === "range") {
      const rangeConfig = gallerySectionConfig.renderOptions.rangeConfig;

      const range = rangeConfig.max - rangeConfig.min;
      const numSteps =
        rangeConfig.numSteps ||
        (rangeConfig.step ? Math.ceil(range / rangeConfig.step) : 35);
      const step = rangeConfig.step || roundTwoDecimals(range / numSteps);
      const sliderStep = Math.max(roundTwoDecimals(range / numSteps), 0.01);

      return {
        ...gallerySectionConfig,
        renderOptions: {
          ...gallerySectionConfig.renderOptions,
          rangeConfig: {
            ...gallerySectionConfig.renderOptions.rangeConfig,
            step,
            sliderStep,
          },
        },
        selectedValue: gallerySectionConfig.defaultValue || rangeConfig.min,
      };
    } else if (gallerySectionConfig.selectionType === "color") {
      return {
        ...gallerySectionConfig,
        selectedValue: gallerySectionConfig.defaultValue || "#000",
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
        selectedValue:
          gallerySectionConfig.defaultValue ||
          gallerySectionConfig.renderOptions.valuesToRender[0],
      };
    } else if (gallerySectionConfig.selectionType === "text") {
      return {
        ...gallerySectionConfig,
        selectedValue: gallerySectionConfig.defaultValue || "",
      };
    } else if (gallerySectionConfig.selectionType === "toggle") {
      return {
        ...gallerySectionConfig,
        selectedValue: gallerySectionConfig.defaultValue || false,
      };
    } else {
      return gallerySectionConfig;
    }
  });

const applyValuesToGallerySectionConfigList = (
  gallerySectionConfigList: GallerySectionConfig[],
  helmetConfig: HelmetConfig
) => {
  for (const row of gallerySectionConfigList) {
    row.selectedValue = getProperty(helmetConfig, row.key);
  }
};

const updateUrlHash = (helmetConfig: HelmetConfig) => {
  history.replaceState(undefined, "", `#${btoa(JSON.stringify(helmetConfig))}`);
};

const generateInitialHelmetConfig = () => {
  let helmetConfig: HelmetConfig;
  if (location.hash.length <= 1) {
    helmetConfig = generateHelmetConfigFromOverrides({
      helmetConfigOverrides: {},
    });
  } else {
    try {
      helmetConfig = JSON.parse(atob(location.hash.slice(1)));
    } catch (error) {
      console.error(error);
      helmetConfig = generateHelmetConfigFromOverrides({
        helmetConfigOverrides: {},
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
  helmetConfig: initialHelmetConfig,
  setHelmetConfig: (helmetConfig) =>
    set((state: CombinedState) => {
      history.replaceState(
        undefined,
        "",
        `#${btoa(JSON.stringify(helmetConfig))}`
      );

      applyValuesToGallerySectionConfigList(
        gallerySectionConfigList,
        helmetConfig
      );
      updateUrlHash(helmetConfig);

      return {
        ...state,
        gallerySectionConfigList: [...gallerySectionConfigList],
        helmetConfig: { ...helmetConfig },
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
    gallerySectionConfig.selectionType === "options" ||
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
