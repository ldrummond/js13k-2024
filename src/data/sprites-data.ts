import { char_y, pixel_size } from "@/core/constants";
import { spritesheet_data } from "@/data/spritesheet-data";
import { SpriteData } from "@/core/sprite";


export const sprite_data_list: SpriteData[] = [
  {
    x: 16,
    y: 10,
    w: 10,
    spritesheet_rects: [spritesheet_data['minion']]
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
