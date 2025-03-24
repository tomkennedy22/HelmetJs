import { HelmetConfig } from "../src";
import { getCurrentTimestampAsString } from "./utils";
import { toPng } from "html-to-image";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.download = filename;
  a.href = url;

  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 30 * 1000);
  };

  a.addEventListener("click", clickHandler, false);

  a.click();
};

export const downloadHelmetPng = async (wrapper: HTMLDivElement) => {
  const size = { width: 512, height: 460 };
  const sizeAdjustedWrapper = wrapper.cloneNode(true) as HTMLDivElement;

  sizeAdjustedWrapper.style.width = `${size.width}px`;
  sizeAdjustedWrapper.style.height = `${size.height}px`;

  const dataUrl = await toPng(sizeAdjustedWrapper, {
    ...size,

    quality: 0.5,
  });
  const blob = await fetch(dataUrl).then((res) => res.blob());
  downloadBlob(blob, `helmetjs-${getCurrentTimestampAsString()}.png`);
};

export const downloadHelmetSvg = (wrapper: HTMLDivElement) => {
  const blob = new Blob([wrapper.innerHTML], { type: "image/svg+xml" });
  downloadBlob(blob, `helmetjs-${getCurrentTimestampAsString()}.svg`);
};

export const downloadHelmetJson = (helmetConfig: HelmetConfig) => {
  const helmetConfigString = JSON.stringify(helmetConfig, null, 2);
  const blob = new Blob([helmetConfigString], { type: "application/json" });
  downloadBlob(blob, `helmetjs-${getCurrentTimestampAsString()}.json`);
};
