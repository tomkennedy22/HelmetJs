import { create } from "zustand";
import {
  generateTeamHelmetConfigFromOverrides,
  TeamHelmetConfig,
} from "../src";

const initialHelmetConfig = generateTeamHelmetConfigFromOverrides({
  teamHelmetConfigOverrides: {
    helmetColor: "#f00",
    facemaskColor: "#fff",
  },
});

interface HelmetState {
  teamHelmetConfig: TeamHelmetConfig;
  setTeamHelmetConfig: (teamHelmetConfig: TeamHelmetConfig) => void;
}

export const useHelmetStore = create<HelmetState>()((set) => ({
  teamHelmetConfig: initialHelmetConfig,
  setTeamHelmetConfig: (teamHelmetConfig) =>
    set((state) => ({ ...state, teamHelmetConfig })),
}));
