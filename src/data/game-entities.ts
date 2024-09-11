import { globals, grid_col, grid_row, panel_top_row, pixel_size, Resources } from "@/core/constants";
import { GameEntity } from "@/core/game-entity";
import { spritesheet } from "@/spritesheet";
import { GameEntityState, GameEntityParams } from "@/core/game-entity";

const organ_x = grid_col(1) / pixel_size;
const organ_y = (panel_top_row) / pixel_size;

const violin_y = (panel_top_row + grid_row(4.25)) / pixel_size;

const book_x = 183;
const book_y = (panel_top_row + grid_row(11)) / pixel_size;
const book_w = 17;
const book_space = 27;

export const game_entities_data_list: GameEntityParams[] = [
  ////////////////////////////////////////////////
  // Organs
  ////////////////////////////////////////////////
  {
    name: "eye",
    description: "the final evolution",
    state: GameEntityState.LOCKED,
    cost: {
      [Resources.HORMONES]: 100,
      [Resources.MATURITY]: 50,
      [Resources.KNOWLEDGE]: 4
    },
    gain: {
      // [Resources.HORMONES]: {
      //   per_second: 0.5
      // }
    },
    is_one_time_purchase: true,
    sprite_data: {
      x: organ_x + 25,
      y: organ_y + 5,
      w: 19,
      spritesheet_rect: [spritesheet.eye]
    },
  },
  {
    // TODO: Simplify locked vs click
    name: "pituitary",
    description: "starts hormone production.",
    // cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE,
    cost: {
      [Resources.HORMONES]: 10
    },
    gain: {
      [Resources.HORMONES]: {
        per_second: 0.5
      }
    },
    is_one_time_purchase: true,
    sprite_data: {
      x: organ_x + 30,
      y: organ_y + 50,
      w: 10,
      spritesheet_rect: [spritesheet.pituitary]
    },
  },
  {
    // TODO: Simplify locked vs click
    name: "kidney",
    description: "starts hormone production.",
    // cooldown_duration: 2000,
    state: GameEntityState.LOCKED,
    cost: {
      [Resources.HORMONES]: 10
    },
    gain: {
      [Resources.HORMONES]: {
        per_second: 0.5
      }
    },
    is_one_time_purchase: true,
    sprite_data: {
      x: organ_x + 5,
      y: organ_y + 72,
      w: 16,
      spritesheet_rect: [spritesheet.kidney]
    },
  },
  {
    name: "brain",
    description: "The root of all evil",
    cooldown_duration: 1000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.HORMONES]: {
        quantity: 10
      }
    },
    sprite_data: {
      x: organ_x + 23,
      y: organ_y + 27,
      w: 23,
      spritesheet_rect: [spritesheet.brain]
    },
  },
  {
    name: "lungs",
    description: "Throat organs",
    cooldown_duration: 1000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.HORMONES]: {
        quantity: 10
      }
    },
    sprite_data: {
      x: organ_x + 24,
      y: organ_y + 68,
      w: 24,
      spritesheet_rect: [spritesheet.lungs]
    },
  },
  {
    name: "bones",
    description: "Growth spurt",
    cooldown_duration: 1000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.HORMONES]: {
        quantity: 10
      }
    },
    sprite_data: {
      x: organ_x + 53,
      y: organ_y + 74,
      w: 11.5,
      spritesheet_rect: [spritesheet.bone]
    },
  },
  {
    name: "claws",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    onClick() {
      // game_data.hormones.increase_per_second += 0.1;
    },
    sprite_data: {
      x: organ_x + 5,
      y: organ_y + 49,
      w: 20,
      mirrored: 17,
      spritesheet_rect: [spritesheet.claw]
    },
  },
  {
    name: "horns",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    onClick() {
      // game_data.hormones.increase_per_second += 0.1;
    },
    sprite_data: {
      x: organ_x + 4,
      y: organ_y + 8,
      w: 14,
      mirrored: 20,
      spritesheet_rect: [spritesheet.horn,]
    },
  },
  {
    name: "hooves",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      x: organ_x + 4,
      y: organ_y + 129,
      w: 17,
      mirrored: 15,
      spritesheet_rect: [spritesheet.foot]
    },
  },
  {
    name: "tail",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      x: organ_x + 4,
      y: organ_y + 99,
      w: 39,
      spritesheet_rect: [spritesheet.tail]
    },
  },
  ////////////////////////////////////////////////
  // Music
  ////////////////////////////////////////////////
  {
    name: "violin",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      // x: 260,
      x: 182,
      y: violin_y,
      w: 22,
      spritesheet_rect: [spritesheet.violin]
    },
  },
  ////////////////////////////////////////////////
  // BOOKS
  ////////////////////////////////////////////////
  {
    name: "codex gigas",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.KNOWLEDGE]: {
        quantity: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 0,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet.book1]
    },
  },
  {
    name: "the black arts",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.KNOWLEDGE]: {
        quantity: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 1,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet.book2]
    },
  },
  {
    name: "Dantes Inferno",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.KNOWLEDGE]: {
        quantity: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 2,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet.book3]
    },
  },
  {
    name: "chicken soup for the teenage devil",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.KNOWLEDGE]: {
        quantity: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 3 - 1,
      y: book_y,
      w: book_w + 2,
      spritesheet_rect: [spritesheet.book5]
    },
  },
  // Volume buttons
  {
    state: GameEntityState.AVAILABLE, 
    onClick() {
      const self = this as GameEntity;
      globals.volume = 1 - globals.volume;
      self.active_interactive_canvases = self.sprite_frames_interactive_canvases.next();
    },
    sprite_data: {
      x: 276,
      y: 10,
      w: 10,
      spritesheet_rect: [spritesheet.iconPlaying, spritesheet.iconMuted]
    },
  },
];