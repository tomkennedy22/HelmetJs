import { RefObject, useRef } from "react";
import { DownloadSimple, LinkSimple, CaretDown } from "@phosphor-icons/react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  type useDisclosure,
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
import { classNames } from "./utils";

const copyStringToClipboard = async (str: string) => {
  await navigator.clipboard.writeText(str);
};

const MainHelmetActionBar = ({
  helmetRef,
  uploadModalDisclosure,
  compareModalDisclosure,
}: {
  helmetRef: RefObject<HTMLDivElement | null> | null;
  uploadModalDisclosure: ReturnType<typeof useDisclosure>;
  compareModalDisclosure: ReturnType<typeof useDisclosure>;
}) => {
  const { helmetConfig } = useHelmetStore();

  console.log("MainHelmetActionBar", {
    helmetConfig,
    helmetRef,
    uploadModalDisclosure,
    compareModalDisclosure,
  });

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
    // {
    //   groupName: "Upload",
    //   groupIcon: <UploadSimple size={24} />,
    //   baseAction: onUploadOpen,
    // },
    // {
    //   groupName: "Compare",
    //   groupIcon: <MagnifyingGlass size={24} />,
    //   baseAction: onCompareOpen,
    // },
  ];

  const buttonStyle = {
    backgroundColor: helmetConfig.helmetColor,
    // borderColor: helmetConfig.helmetColor,
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
                <span>{group.groupName}</span>
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

export const MainHelmet = ({
  className,
  uploadModalDisclosure,
  compareModalDisclosure,
}: {
  className: string;
  uploadModalDisclosure: ReturnType<typeof useDisclosure>;
  compareModalDisclosure: ReturnType<typeof useDisclosure>;
}) => {
  const { helmetConfig } = useHelmetStore();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Card className="flex-1 h-[90vh]">
      <CardBody>
        <Helmet
          className={classNames(className)}
          helmetConfig={helmetConfig}
          // style={{ borderColor: helmetConfig.helmetColor }}
          ref={ref}
        />
      </CardBody>
      <Divider />
      <CardFooter
        style={{
          borderColor: helmetConfig.helmetColor,
          backgroundColor: helmetConfig.helmetColor,
        }}>
        <MainHelmetActionBar
          uploadModalDisclosure={uploadModalDisclosure}
          compareModalDisclosure={compareModalDisclosure}
          helmetRef={ref}
        />
      </CardFooter>
    </Card>
    // <div className="flex flex-col gap-4 w-[50%]">
    //   <Helmet
    //     className={classNames(
    //       className,
    //       "border-5 rounded-lg shadow-medium h-[80%] w-fit"
    //     )}
    //     helmetConfig={helmetConfig}
    //     style={{ borderColor: helmetConfig.helmetColor }}
    //     ref={ref}
    //   />
    //   <MainHelmetActionBar
    //     uploadModalDisclosure={uploadModalDisclosure}
    //     compareModalDisclosure={compareModalDisclosure}
    //     helmetRef={ref}
    //   />
    // </div>
  );
};
