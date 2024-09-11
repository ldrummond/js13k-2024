import { footer_space, footer_x, footer_y, grid_col, panel_top_row, pixel_size } from "@/core/constants";
import { spritesheet } from "@/spritesheet";
import { SpriteData } from "@/core/sprite";

const icon_width = 10;

export const sprite_data_list: SpriteData[] = [
  {
    x: (grid_col(22) - 4) / pixel_size,
    y: (panel_top_row + 20) / pixel_size,
    w: 10,
    spritesheet_rect: [spritesheet.minion]
  },
  {
    x: footer_x + footer_space * 0,
    y: footer_y,
    w: icon_width,
    spritesheet_rect: [spritesheet.iconHormones]
  },
  {
    x: footer_x + footer_space * 1,
    y: footer_y,
    w: icon_width,
    spritesheet_rect: [spritesheet.iconHorn]
  },
  {
    x: footer_x + footer_space * 2,
    y: footer_y,
    w: icon_width,
    spritesheet_rect: [spritesheet.iconCoin]
  },
  {
    x: footer_x + footer_space * 3,
    y: footer_y,
    w: icon_width,
    spritesheet_rect: [spritesheet.iconScroll]
  },
  {
    x: 98,
    y: (panel_top_row * 1.5) / pixel_size,
    w: 60,
    spritesheet_rect: [
      spritesheet["character 0"],
      spritesheet["character 1"]
    ],
    frame_duration: 2000,
  },
];
