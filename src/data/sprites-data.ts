import { footer_space, footer_x, footer_y, grid_col, panel_top_row, pixel_size } from "@/core/constants";
import { spritesheet_data } from "@/data/spritesheet-data";
import { SpriteData } from "@/core/sprite";

const icon_width = 10;

export const sprite_data_list: SpriteData[] = [
  {
    x: (grid_col(22) - 2) / pixel_size,
    y: (panel_top_row + 45) / pixel_size,
    w: 10,
    spritesheet_rects: [spritesheet_data['minion']]
  },
  {
    x: footer_x + footer_space * 0,
    y: footer_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconHormones']]
  },
  {
    x: footer_x + footer_space * 1,
    y: footer_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconHorn']]
  },
  {
    x: footer_x + footer_space * 2,
    y: footer_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconCoin']]
  },
  {
    x: footer_x + footer_space * 3,
    y: footer_y,
    w: icon_width,
    spritesheet_rects: [spritesheet_data['iconScroll']]
  },
  {
    x: 98,
    y: (panel_top_row * 1.5) / pixel_size,
    w: 60,
    spritesheet_rects: [
      spritesheet_data["character 0"],
      spritesheet_data["character 1"]
    ],
    frame_duration: 2000,
  },
];
