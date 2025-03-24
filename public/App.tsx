import { Input, Select, SelectItem, Slider, Switch } from "@heroui/react";
import {
  generateHelmetConfigFromOverrides,
  Helmet,
  HelmetConfig,
} from "../src";
import { getOverrideListForItem, useHelmetStore } from "./helmetState";
import { TopBar } from "./TopBar";
import { ColorPicker } from "./ColorPicker";
import { getProperty, setProperty } from "dot-prop";
import {
  CombinedState,
  GallerySectionConfig,
  GallerySectionConfigOptions,
  OverrideListItem,
} from "./types";
import { useEffect, useState } from "react";
import {
  deepCopy,
  doesStrLookLikeColor,
  override,
  roundTwoDecimals,
} from "./utils";
import { MainHelmet } from "./MainHelmet";
import ReactGA from "react-ga4";

const updateStores = ({
  helmetConfig,
  stateStoreProps,
}: {
  helmetConfig: HelmetConfig;
  stateStoreProps: CombinedState;
  // overrideList: OverrideListItem[];
}) => {
  const { setHelmetConfig } = stateStoreProps;

  setHelmetConfig(helmetConfig);
};

const inputOnChange = ({
  chosenValue,
  helmetConfig,
  key,
  // overrideList,
  stateStoreProps,
}: {
  chosenValue: unknown;
  helmetConfig: HelmetConfig;
  key: string;
  overrideList: OverrideListItem[];
  stateStoreProps: CombinedState;
}) => {
  const helmetConfigCopy = generateHelmetConfigFromOverrides({
    helmetConfigOverrides: { ...helmetConfig, [key]: chosenValue },
  });
  updateStores({
    helmetConfig: helmetConfigCopy,
    stateStoreProps,
    // overrideList,
  });
};

// const SliderOverrideInput = ({
//   value,
//   onChange,
// }: {
//   value: number;
//   onChange: (value: number) => void;
// }) => {
//   const [valueString, setValueString] = useState(String(value));

//   useEffect(() => {
//     setValueString(String(value));
//   }, [value]);

//   return (
//     <input
//       className="px-1 py-0.5 w-12 text-right text-small text-default-700 font-medium bg-default-100 outline-none transition-colors rounded-sm border-medium border-transparent hover:border-primary focus:border-primary"
//       type="text"
//       value={valueString}
//       onChange={(e) => {
//         setValueString(e.target.value);
//         const parsedValue = parseFloat(e.target.value);
//         if (!Number.isNaN(parsedValue)) {
//           onChange(parsedValue);
//         }
//       }}
//     />
//   );
// };

const FeatureSelector = ({
  gallerySectionConfig,
  overrideList,
  stateStoreProps,
  sectionIndex,
}: {
  gallerySectionConfig: GallerySectionConfig;
  overrideList: OverrideListItem[];
  stateStoreProps: CombinedState;
  sectionIndex: number;
}) => {
  const { helmetConfig } = stateStoreProps;

  if (!gallerySectionConfig) {
    return <div>Select a feature</div>;
  }

  const selectedVal: string | number | boolean = getProperty(
    helmetConfig,
    gallerySectionConfig.key
  );

  if (gallerySectionConfig.selectionType === "options") {
    const optionsGallerySectionConfig =
      gallerySectionConfig as GallerySectionConfigOptions;

    return (
      <div
        key={sectionIndex}
        className="w-full max-w-md flex gap-4">
        <Select
          label={optionsGallerySectionConfig.text}
          selectedKeys={[optionsGallerySectionConfig.selectedValue]}
          onChange={(e) => {
            const chosenValue = e.target.value;
            inputOnChange({
              chosenValue,
              helmetConfig,
              key: optionsGallerySectionConfig.key,
              overrideList,
              stateStoreProps,
            });
          }}>
          {optionsGallerySectionConfig.renderOptions.valuesToRender.map(
            (optionValue) => {
              return (
                <SelectItem key={String(optionValue)}>{optionValue}</SelectItem>
              );
            }
          )}
        </Select>
      </div>
    );
  } else if (gallerySectionConfig.selectionType === "toggle") {
    const inputValue = selectedVal as boolean;

    return (
      <Switch
        key={sectionIndex}
        // checked={inputValue}
        // defaultChecked={inputValue}
        isSelected={inputValue}
        onChange={(e) => {
          const chosenValue = e.target.checked;
          inputOnChange({
            chosenValue,
            helmetConfig,
            key: gallerySectionConfig.key,
            overrideList,
            stateStoreProps,
          });
        }}>
        {gallerySectionConfig.text}
      </Switch>
    );
  } else if (gallerySectionConfig.selectionType === "text") {
    const inputValue = selectedVal as string;

    return (
      <Input
        key={sectionIndex}
        label={gallerySectionConfig.text}
        value={inputValue}
        onChange={(e) => {
          const chosenValue = e.target.value;
          inputOnChange({
            chosenValue,
            helmetConfig,
            key: gallerySectionConfig.key,
            overrideList,
            stateStoreProps,
          });
        }}
      />
    );
  } else if (gallerySectionConfig.selectionType === "range") {
    const inputValue = (selectedVal as number) || 0;

    const onChange = (newValue: number) => {
      const chosenValue = roundTwoDecimals(newValue);
      inputOnChange({
        chosenValue,
        helmetConfig,
        key: gallerySectionConfig.key,
        overrideList,
        stateStoreProps,
      });
    };

    return (
      <Slider
        key={sectionIndex}
        className="max-w-md"
        label={
          <span className="text-xs text-foreground-600">
            {gallerySectionConfig.text}
          </span>
        }
        step={gallerySectionConfig.renderOptions.rangeConfig.sliderStep}
        maxValue={gallerySectionConfig.renderOptions.rangeConfig.max}
        minValue={gallerySectionConfig.renderOptions.rangeConfig.min}
        defaultValue={gallerySectionConfig.defaultValue}
        value={inputValue}
        onChange={(val) => onChange(val as number)}></Slider>
    );
  } else if (
    gallerySectionConfig.selectionType == "color" ||
    gallerySectionConfig.selectionType === "colors"
  ) {
    const numColors =
      gallerySectionConfig.selectionType == "color"
        ? 1
        : gallerySectionConfig.renderOptions.colorCount;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [inputValidationArr, setInputValidationArr] = useState<boolean[]>(
      Array(numColors).fill(true)
    );

    const updateValidationAtIndex = (
      indexToUpdate: number,
      newValue: boolean
    ) => {
      const newArr = [...inputValidationArr];
      newArr[indexToUpdate] = newValue;
      setInputValidationArr(newArr);
    };

    const colorInputOnChange = ({
      newColorValue,
      // hasMultipleColors,
      colorIndex,
    }: {
      newColorValue: string;
      hasMultipleColors: boolean;
      colorIndex: number;
    }) => {
      // const colorLooksValid = doesStrLookLikeColor(newColorValue);

      updateValidationAtIndex(colorIndex, doesStrLookLikeColor(newColorValue));

      setProperty(helmetConfig, gallerySectionConfig.key, newColorValue);
      const chosenValue = getProperty(helmetConfig, gallerySectionConfig.key);

      inputOnChange({
        chosenValue,
        helmetConfig,
        key: gallerySectionConfig.key,
        overrideList,
        stateStoreProps,
      });
    };

    const colorFormat = gallerySectionConfig.colorFormat || "hex";

    return (
      <div
        key={sectionIndex}
        className="flex gap-2 flex-wrap justify-end items-end">
        {Array.from({ length: Math.min(numColors) }).map((_, colorIndex) => {
          const hasMultipleColors =
            gallerySectionConfig.selectionType == "colors";
          const selectedColor =
            // @ts-expect-error TS doesnt like conditional array vs string
            hasMultipleColors ? selectedVal[colorIndex] : selectedVal;

          const presetColors = hasMultipleColors
            ? gallerySectionConfig.renderOptions.valuesToRender.map(
                (colorList: string[]) => colorList[colorIndex]
              )
            : gallerySectionConfig.renderOptions.valuesToRender;

          return (
            <div
              key={colorIndex}
              className="w-fit">
              {colorIndex === 0 ? (
                <label className="text-xs text-foreground-600 mb-2">
                  {gallerySectionConfig.text}
                </label>
              ) : null}
              <div
                key={colorIndex}
                className="flex gap-2">
                <ColorPicker
                  onChange={(color) => {
                    colorInputOnChange({
                      newColorValue: color,
                      hasMultipleColors,
                      colorIndex,
                    });
                  }}
                  colorFormat={colorFormat}
                  presetColors={presetColors}
                  value={selectedColor}
                />
                <Input
                  value={selectedColor}
                  isInvalid={!inputValidationArr[colorIndex]}
                  className="min-w-52"
                  onChange={(e) => {
                    colorInputOnChange({
                      newColorValue: e.target.value,
                      hasMultipleColors,
                      colorIndex,
                    });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <> </>;
  }
};

function App() {
  const stateStoreProps = useHelmetStore();

  const { helmetConfig, gallerySize, gallerySectionConfigList } =
    stateStoreProps;

  useEffect(() => {
    ReactGA.initialize("G-X4V71EMDVS");
    ReactGA.send("pageview");
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex gap-8 w-screen mt-16 px-8">
        <div className="w-full flex-1 overflow-y-scroll max-h-[90lvh] h-min grid grid-cols-2">
          {gallerySectionConfigList.map(
            (gallerySectionConfig, sectionIndex) => {
              const overrideList = getOverrideListForItem(gallerySectionConfig);

              if (gallerySectionConfig.enableDisplayFn) {
                const shouldDisplay =
                  gallerySectionConfig.enableDisplayFn(helmetConfig);
                if (!shouldDisplay) {
                  return null;
                }
              }

              return (
                <div
                  key={sectionIndex}
                  className={"py-6 border-b-1 border-slate-400 content-center"}>
                  <div className="m-1 flex gap-4 justify-between">
                    <div className="mb-2 flex justify-start grow">
                      <FeatureSelector
                        gallerySectionConfig={gallerySectionConfig}
                        overrideList={overrideList}
                        stateStoreProps={stateStoreProps}
                        sectionIndex={sectionIndex}
                      />
                    </div>
                  </div>
                  {gallerySize != "sm" && (
                    <div
                      className={`w-full flex justify-start gap-8${
                        gallerySize === "lg" ? " flex-wrap" : ""
                      }${gallerySize === "md" ? " overflow-x-auto" : ""}`}>
                      {overrideList.map((overrideToRun, faceIndex) => {
                        const selected =
                          gallerySectionConfig.selectedValue ==
                          overrideToRun.value;

                        return (
                          <div
                            key={faceIndex}
                            className={`rounded-lg cursor-pointer hover:bg-slate-100 hover:border-slate-500 border-2 border-inherit flex justify-center active:scale-90 transition-transform ease-in-out${
                              selected
                                ? " bg-slate-200 hover:border-slate-500"
                                : ""
                            }`}
                            onClick={() => {
                              const helmetConfigCopy = deepCopy(helmetConfig);

                              override(
                                helmetConfigCopy,
                                overrideToRun.override
                              );

                              updateStores({
                                helmetConfig: helmetConfigCopy,
                                stateStoreProps,
                              });
                            }}>
                            <Helmet helmetConfig={helmetConfig} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
        <MainHelmet className="flex-1" />
      </div>
    </div>
  );
}

export default App;
