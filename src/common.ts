export const helmetStyles = [
  "Standard",
  "Tiger Stripe",
  "Wing",
  "Horn",
] as const;
const baseColor = "#f00";
const darkColor = "#272727";

type HelmetStyle = (typeof helmetStyles)[number];

type HelmetConfigBase = {
  flipHelmet: boolean;
  helmetColor: string;
  facemaskColor: string;
  helmetLogoUrl?: string;
  xAdjust: number;
  yAdjust: number;
  helmetLogoScale: number;
  enableLogo: boolean;
  useFlippedLogoUrlWhenFlipped: boolean;
  flipLogoWithHelmet: boolean;
  flippedHelmetLogoUrl?: string;
  enableHelmetStickers: boolean;
  helmetStickerUrl?: string;
  numHelmetStickers?: number;
};

type HelmetStyleConfig = {
  helmetStyle?: HelmetStyle;
  tigerStripeColor?: string;
  wingColor?: string;
  hornColor?: string;
};

export type HelmetConfig = HelmetConfigBase & HelmetStyleConfig;

export type HelmetConfigOverrides = Partial<HelmetConfig>;

export const generateHelmetConfigFromOverrides = ({
  helmetConfigOverrides,
}: {
  helmetConfigOverrides: HelmetConfigOverrides;
}): HelmetConfig => {
  const helmetConfig: HelmetConfig = {
    flipHelmet: helmetConfigOverrides?.flipHelmet || false,
    helmetColor: helmetConfigOverrides?.helmetColor || baseColor,
    facemaskColor: helmetConfigOverrides?.facemaskColor || darkColor,
    helmetLogoUrl: helmetConfigOverrides?.helmetLogoUrl || undefined,
    xAdjust: helmetConfigOverrides?.xAdjust || 0,
    yAdjust: helmetConfigOverrides?.yAdjust || 0,
    enableLogo: helmetConfigOverrides?.enableLogo || false,
    flipLogoWithHelmet: helmetConfigOverrides?.flipLogoWithHelmet || false,
    useFlippedLogoUrlWhenFlipped:
      helmetConfigOverrides?.useFlippedLogoUrlWhenFlipped || false,
    flippedHelmetLogoUrl:
      helmetConfigOverrides?.flippedHelmetLogoUrl || undefined,
    helmetStyle: helmetConfigOverrides?.helmetStyle || "Standard",
    tigerStripeColor: helmetConfigOverrides?.tigerStripeColor || darkColor,
    wingColor: helmetConfigOverrides?.wingColor || darkColor,
    hornColor: helmetConfigOverrides?.hornColor || darkColor,
    helmetLogoScale: helmetConfigOverrides?.helmetLogoScale || 1,
    enableHelmetStickers: helmetConfigOverrides?.enableHelmetStickers || false,
    helmetStickerUrl: helmetConfigOverrides?.helmetStickerUrl || undefined,
    numHelmetStickers: helmetConfigOverrides?.numHelmetStickers || 5,
  };

  return helmetConfig;
};
