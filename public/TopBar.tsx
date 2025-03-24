import { Button } from "@heroui/react";
import { GithubLogo, Star } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const Starwatchers = () => {
  const owner = "tomkennedy22";
  const repo = "HelmetJs";
  const [starCount, setStarCount] = useState(2);

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setStarCount(data.stargazers_count);
      } catch (err) {
        console.error("Error fetching star count:", err);
      }
    };

    fetchStarCount();
  }, [owner, repo]);

  return <span>{starCount}</span>;
};

export const TopBar = () => {
  return (
    <div className="bg-slate-800 text-white flex justify-between w-screen fixed z-50 py-2 px-8 items-center text-center text-xl">
      <span className="hidden md:inline mr-4 ">HelmetJs editor</span>
      <Button
        as={"a"}
        className="rounded-md text-white"
        variant="bordered"
        href="https://github.com/tomkennedy22/HelmetJs">
        <GithubLogo
          size={24}
          weight="duotone"
        />
        <div className="text-xs flex gap-1 items-center">
          <Starwatchers />
          <Star
            size={12}
            weight="duotone"
          />
        </div>
      </Button>
    </div>
  );
};
