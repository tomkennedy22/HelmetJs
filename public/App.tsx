import { Input, Select, SelectItem, Slider, Switch } from "@heroui/react";
import {
  generateTeamHelmetConfigFromOverrides,
  TeamHelmet,
  TeamHelmetConfig,
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
import { useState } from "react";
import {
  deepCopy,
  doesStrLookLikeColor,
  override,
  roundTwoDecimals,
} from "./utils";

const updateStores = ({
  teamHelmetConfig,
  stateStoreProps,
}: // overrideList,
{
  teamHelmetConfig: TeamHelmetConfig;
  stateStoreProps: CombinedState;
  // overrideList: OverrideListItem[];
}) => {
  const { setTeamHelmetConfig } = stateStoreProps;

  setTeamHelmetConfig(teamHelmetConfig);
};

const inputOnChange = ({
  chosenValue,
  teamHelmetConfig,
  key,
  // overrideList,
  stateStoreProps,
}: {
  chosenValue: unknown;
  teamHelmetConfig: TeamHelmetConfig;
  key: string;
  overrideList: OverrideListItem[];
  stateStoreProps: CombinedState;
}) => {
  const teamHelmetConfigCopy = generateTeamHelmetConfigFromOverrides({
    teamHelmetConfigOverrides: { ...teamHelmetConfig, [key]: chosenValue },
  });
  updateStores({
    teamHelmetConfig: teamHelmetConfigCopy,
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
  const { teamHelmetConfig } = stateStoreProps;

  if (!gallerySectionConfig) {
    return <div>Select a feature</div>;
  }

  const selectedVal: string | number | boolean = getProperty(
    teamHelmetConfig,
    gallerySectionConfig.key
  );

  if (gallerySectionConfig.selectionType === "options") {
    console.log("options", {
      gallerySectionConfig,
      selectedVal,
      teamHelmetConfig,
    });

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
              teamHelmetConfig,
              key: optionsGallerySectionConfig.key,
              overrideList,
              stateStoreProps,
            });
          }}>
          {optionsGallerySectionConfig.renderOptions.valuesToRender.map(
            (optionValue) => {
              console.log("overrideToRun", {
                optionValue,
                overrideList,
                optionsGallerySectionConfig,
              });
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
        checked={inputValue}
        onChange={(e) => {
          const chosenValue = e.target.checked;
          inputOnChange({
            chosenValue,
            teamHelmetConfig,
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
            teamHelmetConfig,
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
        teamHelmetConfig,
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
        defaultValue={0.4}
        value={inputValue}
        onChange={(val) => onChange(val as number)}
        // renderValue={({ children, ...props }) => (
        //   <output {...props}>
        //     <SliderOverrideInput
        //       onChange={onChange}
        //       value={inputValue}
        //     />
        //   </output>
        // )}
      ></Slider>
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
      hasMultipleColors,
      colorIndex,
    }: {
      newColorValue: string;
      hasMultipleColors: boolean;
      colorIndex: number;
    }) => {
      updateValidationAtIndex(colorIndex, doesStrLookLikeColor(newColorValue));

      console.log("colorInputOnChange", {
        newColorValue,
        hasMultipleColors,
        colorIndex,
      });

      // let chosenValue = getProperty(teamHelmetConfig, gallerySectionConfig.key);
      setProperty(teamHelmetConfig, gallerySectionConfig.key, newColorValue);
      const chosenValue = getProperty(
        teamHelmetConfig,
        gallerySectionConfig.key
      );
      // if (chosenValue) {
      //   if (hasMultipleColors) {
      //     chosenValue[colorIndex] = newColorValue;
      //   } else {
      //     chosenValue = newColorValue;
      //   }
      // }

      inputOnChange({
        chosenValue,
        teamHelmetConfig,
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

  const { teamHelmetConfig, gallerySize, gallerySectionConfigList } =
    stateStoreProps;

  return (
    <div className="flex flex-col">
      <TopBar />
      <div className="flex gap-8 w-screen mt-16 px-8">
        <div className="w-full flex flex-col overflow-hidden">
          {gallerySectionConfigList.map(
            (gallerySectionConfig, sectionIndex) => {
              const overrideList = getOverrideListForItem(gallerySectionConfig);

              return (
                <div
                  key={sectionIndex}
                  className={`${
                    sectionIndex === 0
                      ? "pb-6"
                      : "py-6 border-t-2 border-t-slate-400"
                  }`}>
                  <div className="m-1 flex gap-4 justify-between items-center">
                    <div className="mb-2 flex justify-end grow">
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

                        // const helmetWidth = gallerySize == "md" ? 100 : 150;

                        return (
                          <div
                            key={faceIndex}
                            className={`rounded-lg cursor-pointer hover:bg-slate-100 hover:border-slate-500 border-2 border-inherit flex justify-center active:scale-90 transition-transform ease-in-out${
                              selected
                                ? " bg-slate-200 hover:border-slate-500"
                                : ""
                            }`}
                            onClick={() => {
                              const teamHelmetConfigCopy =
                                deepCopy(teamHelmetConfig);

                              console.log("set property", {
                                teamHelmetConfigCopy,
                                overrideToRun,
                              });

                              override(
                                teamHelmetConfigCopy,
                                overrideToRun.override
                              );

                              updateStores({
                                teamHelmetConfig: teamHelmetConfigCopy,
                                stateStoreProps,
                              });
                            }}>
                            <TeamHelmet teamHelmetConfig={teamHelmetConfig} />
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
        <div
          className="rounded-md border-4 h-[80vh]"
          style={{ borderColor: teamHelmetConfig.helmetColor }}>
          <TeamHelmet teamHelmetConfig={teamHelmetConfig} />
        </div>
      </div>
    </div>
  );
}

export default App;
