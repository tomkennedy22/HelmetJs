import { Select, SelectItem } from "@heroui/react";
import { TeamHelmet, teamHelmetStyles } from "../src";
import { useHelmetStore } from "./helmetState";

function App() {
  const { teamHelmetConfig, setTeamHelmetConfig } = useHelmetStore();

  const updateHelmetStore = ({
    key,
    value,
  }: {
    key: string;
    value: string;
  }) => {
    setTeamHelmetConfig({
      ...teamHelmetConfig,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="w-screen">Header</div>
      <div className="flex gap-2 justify-between w-screen">
        <div className="flex flex-col gap-2 flex-1">
          <div>
            <Select
              className="max-w-xs"
              label="Team Helmet Style"
              placeholder="Select a team helmet style"
              onChange={(e) => {
                console.log("Onchange", e.target.value);
                updateHelmetStore({
                  key: "helmetStyle",
                  value: e.target.value,
                });
              }}>
              {teamHelmetStyles.map((teamHelmetStyle) => (
                <SelectItem key={teamHelmetStyle}>{teamHelmetStyle}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <div className="overflow-y-scroll flex-1">
          <div className="rounded-md border-4 border-red-500 h-[80vh] overflow-hidden">
            <TeamHelmet teamHelmetConfig={teamHelmetConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
