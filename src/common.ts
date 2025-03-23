export const teamHelmetStyles = [
  "standard",
  "tiger-stripes",
  "winged",
  "horned",
] as const;
const baseColor = "#f00";
const darkColor = "#272727";

type TeamHelmetStyle = (typeof teamHelmetStyles)[number];

type TeamHelmetConfigBase = {
  helmetColor: string;
  facemaskColor: string;
  helmetLogoUrl?: string;
  xAdjust: number;
  yAdjust: number;
  helmetLogoScale: number;
  disableLogo: boolean;
  useFlippedLogoUrlWhenFlipped: boolean;
  flipLogoWithHelmet: boolean;
  flippedHelmetLogoUrl?: string;
};

type TeamHelmetStyleConfig = {
  helmetStyle?: TeamHelmetStyle;
  tigerStripeColor?: string;
  wingColor?: string;
  hornColor?: string;
};

export type TeamHelmetConfig = TeamHelmetConfigBase & TeamHelmetStyleConfig;

export type TeamHelmetConfigOverrides = Partial<TeamHelmetConfig>;

export const generateTeamHelmetConfigFromOverrides = ({
  teamHelmetConfigOverrides,
}: {
  teamHelmetConfigOverrides: TeamHelmetConfigOverrides;
}): TeamHelmetConfig => {
  const teamHelmetConfig: TeamHelmetConfig = {
    helmetColor: teamHelmetConfigOverrides?.helmetColor || baseColor,
    facemaskColor: teamHelmetConfigOverrides?.facemaskColor || darkColor,
    helmetLogoUrl: teamHelmetConfigOverrides?.helmetLogoUrl || undefined,
    xAdjust: teamHelmetConfigOverrides?.xAdjust || 0,
    yAdjust: teamHelmetConfigOverrides?.yAdjust || 0,
    disableLogo: teamHelmetConfigOverrides?.disableLogo || false,
    flipLogoWithHelmet: teamHelmetConfigOverrides?.flipLogoWithHelmet || false,
    useFlippedLogoUrlWhenFlipped:
      teamHelmetConfigOverrides?.useFlippedLogoUrlWhenFlipped || false,
    flippedHelmetLogoUrl:
      teamHelmetConfigOverrides?.flippedHelmetLogoUrl || undefined,
    helmetStyle: teamHelmetConfigOverrides?.helmetStyle || "standard",
    tigerStripeColor: teamHelmetConfigOverrides?.tigerStripeColor || darkColor,
    wingColor: teamHelmetConfigOverrides?.wingColor || darkColor,
    hornColor: teamHelmetConfigOverrides?.hornColor || darkColor,
    helmetLogoScale: teamHelmetConfigOverrides?.helmetLogoScale || 1,
  };

  return teamHelmetConfig;
};
