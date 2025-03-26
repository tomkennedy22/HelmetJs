import { RefObject, useRef } from "react";
import { DownloadSimple, LinkSimple, CaretDown } from "@phosphor-icons/react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  CardBody,
  Card,
  CardFooter,
  Divider,
} from "@heroui/react";
import {
  downloadHelmetPng,
  downloadHelmetSvg,
  downloadHelmetJson,
} from "./downloadHelmet";
import { useHelmetStore } from "./helmetState";
import { Helmet } from "../src";
import { classNames, luma } from "./utils";

const copyStringToClipboard = async (str: string) => {
  await navigator.clipboard.writeText(str);
};

const MainHelmetActionBar = ({
  helmetRef,
}: {
  helmetRef: RefObject<HTMLDivElement | null> | null;
}) => {
  const { helmetConfig } = useHelmetStore();

  const helmetColor = helmetConfig.helmetColor;
  const helmetLuma = luma(helmetColor) || 0;

  const acceptableBackgroundColor =
    helmetLuma < 0.6 ? helmetConfig.helmetColor : "black";

  const dropdownConfig = [
    {
      groupName: "Copy",
      groupIcon: <LinkSimple size={24} />,
      baseAction: async () => {
        await copyStringToClipboard(JSON.stringify(helmetConfig));
      },
      items: [
        {
          key: "json",
          text: "Copy JSON",
          description: "Copy current Helmet JSON",
        },
        {
          key: "link",
          text: "Copy Link",
          description: "Copy the link to the editor with this Helmet loaded",
          action: async () => {
            await copyStringToClipboard(window.location.href);
          },
        },
      ],
    },
    {
      groupName: "Download .png",
      groupIcon: <DownloadSimple size={24} />,
      baseAction: async () => {
        if (helmetRef && helmetRef.current) {
          await downloadHelmetPng(helmetRef.current);
        }
      },
      items: [
        {
          key: "png",
          text: "Download .png",
          description: "Download Helmet as a PNG file",
        },
        {
          key: "svg",
          text: "Download .svg",
          description: "Download Helmet as an SVG file",
          action: async () => {
            if (helmetRef && helmetRef.current) {
              await downloadHelmetSvg(helmetRef.current);
            }
          },
        },
        {
          key: "json",
          text: "Download .json",
          description: "Download Helmet as a JSON file",
          action: async () => {
            await downloadHelmetJson(helmetConfig);
          },
        },
      ],
    },
  ];

  const buttonStyle = {
    backgroundColor: acceptableBackgroundColor,
  };

  return (
    <div className="flex gap-4 p-1 flex-wrap justify-center text-white">
      {dropdownConfig.map((group) => {
        if (!group.items) {
          return (
            <Button
              key={`button-${group.groupName}`}
              isIconOnly
              onPress={group.baseAction}
              className=" text-white border-2 border-white"
              style={buttonStyle}
              title={group.groupName}>
              {group.groupIcon}
            </Button>
          );
        }

        return (
          <ButtonGroup key={`button-group-${group.groupName}`}>
            <Button
              // isIconOnly
              onClick={group.baseAction}
              className=" text-white border-2 border-white"
              style={buttonStyle}
              title={group.groupName}>
              <>
                <span className="md:block hidden">{group.groupName}</span>
                {group.groupIcon}
              </>
            </Button>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  className=" text-white border-2 border-l-0 border-white"
                  variant="bordered"
                  style={buttonStyle}>
                  <CaretDown size={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                className="max-w-[300px]">
                {group.items.map((item) => (
                  <DropdownItem
                    key={item.key}
                    description={item.description}
                    onClick={item.action ?? group.baseAction}>
                    {item.text}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        );
      })}
    </div>
  );
};

export const MainHelmet = ({ className }: { className: string }) => {
  const { helmetConfig } = useHelmetStore();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Card className="flex-1 h-[90vh]">
      <CardBody>
        <Helmet
          className={(classNames(className), "h-[80%] w-[80%]")}
          helmetConfig={helmetConfig}
          ref={ref}
        />
      </CardBody>
      <Divider />
      <CardFooter
        style={{
          borderColor: helmetConfig.helmetColor,
          backgroundColor: helmetConfig.helmetColor,
        }}>
        <MainHelmetActionBar helmetRef={ref} />
      </CardFooter>
    </Card>
  );
};
