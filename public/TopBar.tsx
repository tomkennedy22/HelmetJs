import { Button } from "@heroui/react";
import {
  ArrowsClockwise,
  FootballHelmet,
  GithubLogo,
  Star,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { initialHelmetOptions, useHelmetStore } from "./helmetState";
import { pickRandom } from "./utils";
import { generateHelmetConfigFromOverrides } from "../src";

const Starwatchers = () => {
  const owner = "tomkennedy22";
  const repo = "HelmetJs";
  const [starCount, setStarCount] = useState(2);

  useEffect(() => {
    const getCachedStars = () => {
      const cachedData = localStorage.getItem(`github-stars-${owner}-${repo}`);
      if (cachedData) {
        const { stars, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return stars;
        }
      }
      return null;
    };

    const fetchAndCacheStars = async () => {
      try {
        const cachedStars = getCachedStars();
        if (cachedStars !== null) {
          setStarCount(cachedStars);
          return;
        }

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const stars = data.stargazers_count;

        localStorage.setItem(
          `github-stars-${owner}-${repo}`,
          JSON.stringify({
            stars,
            timestamp: Date.now(),
          })
        );

        setStarCount(stars);
      } catch (err) {
        console.error("Error fetching star count:", err);
      }
    };

    fetchAndCacheStars();
  }, [owner, repo]);

  return <span>{starCount}</span>;
};

export const TopBar = () => {
  const { setHelmetConfig } = useHelmetStore();

  return (
    <div className="bg-slate-800 text-white flex justify-between w-screen fixed z-50 py-2 px-8 items-center text-center text-xl">
      <div className="flex gap-1 text-center items-center">
        <FootballHelmet
          size={24}
          weight="duotone"
        />
        <span className="hidden md:inline mr-4 ">HelmetJs editor</span>
      </div>
      <Button
        isIconOnly
        className="rounded-md text-white"
        variant="bordered"
        onClick={() => {
          const helmetConfigOverrides = pickRandom(initialHelmetOptions);
          const newHelmetConfig = generateHelmetConfigFromOverrides({
            helmetConfigOverrides,
          });
          setHelmetConfig(newHelmetConfig);
        }}>
        <ArrowsClockwise size={24} />
      </Button>
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
