import * as react from 'react';
import { CSSProperties } from 'react';

declare const helmetStyles: readonly ["Standard", "Tiger Stripe", "Wing", "Horn"];
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
type HelmetConfig = HelmetConfigBase & HelmetStyleConfig;
type HelmetConfigOverrides = Partial<HelmetConfig>;
declare const generateHelmetConfigFromOverrides: ({ helmetConfigOverrides, }: {
    helmetConfigOverrides: HelmetConfigOverrides;
}) => HelmetConfig;
declare const roundDecimal: (num: number, decimalPlaces: number) => number;

declare const Helmet: react.ForwardRefExoticComponent<{
    className?: string;
    helmetConfig: HelmetConfig;
    ignoreDisplayErrors?: boolean;
    lazy?: boolean;
    style?: CSSProperties;
} & react.RefAttributes<HTMLDivElement>>;

export { Helmet, type HelmetConfig, type HelmetConfigOverrides, generateHelmetConfigFromOverrides, helmetStyles, roundDecimal };
