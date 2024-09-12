import { char_y, footer_space, footer_x, footer_y, pixel_size } from "@/core/constants";
import { spritesheet_data } from "@/data/spritesheet-data";
import { SpriteData } from "@/core/sprite";

const icon_width = 10;
const icon_y = footer_y - icon_width / 2;

export const sprite_data_list: SpriteData[] = [
  {
    x: 16,
    y: 10,
    w: 10,
    spritesheet_rects: [spritesheet_data['minion']]
  },
  {
    x: footer_x + footer_space * 0,
    y: icon_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconHormones']]
  },
  {
    x: footer_x + footer_space * 1,
    y: icon_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconHorn']]
  },
  {
    x: footer_x + footer_space * 2,
    y: icon_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconCoin']]
  },
  {
    x: footer_x + footer_space * 3,
    y: icon_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconScroll']]
  },
  {
    x: 98,
    y: (char_y * 1.25) / pixel_size,
    w: 60,
    spritesheet_rects: [
      spritesheet_data["character 0"],
      spritesheet_data["character 1"]
    ],
    frame_duration: 2000,
  },
];
