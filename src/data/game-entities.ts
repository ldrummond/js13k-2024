import { Resources } from "@/core/constants";
import { spritesheet } from "@/spritesheet";

// TODO: Remove name from sprite?
const book_x = 183;
const book_y = 100;
const book_w = 18;
const book_space = 26;

export enum GameEntityState {
  "LOCKED",
  "AVAILABLE",
  "FLASHING",
  "HOVERING",
  "CLICKING",
  "COOLDOWN"
}

export interface EntityCost {
  [Resources.HORMONES]?: number;
  [Resources.MATURITY]?: number;
  [Resources.CONFIDENCE]?: number;
  [Resources.KNOWLEDGE]?: number;
}

export interface EntityGainDetail {
  quantity?: number;
  per_second?: number;
}

export interface EntityGain {
  [Resources.HORMONES]?: EntityGainDetail;
  [Resources.MATURITY]?: EntityGainDetail;
  [Resources.CONFIDENCE]?: EntityGainDetail;
  [Resources.KNOWLEDGE]?: EntityGainDetail;
}

export interface GameEntityParams {
  name: string;
  description: string;
  state: GameEntityState;
  cooldown_duration?: number;
  cost?: EntityCost;
  gain: EntityGain;
  sprite_data: SpriteData;
  is_one_time_purchase?: boolean; 
  onClick?: () => void;
}

export const game_entities_data_list: GameEntityParams[] = [
  {
    name: "eye",
    description: "the final evolution",
    state: GameEntityState.LOCKED,
    cost: {
      // [Resources.HORMONES]: 10
    },
    gain: {
      // [Resources.HORMONES]: {
      //   per_second: 0.5
      // }
    },
    is_one_time_purchase: true,
    sprite_data: {
      x: 37,
      y: 12,
      w: 18,
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
      x: 41,
      y: 55,
      w: 9,
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
      x: 16,
      y: 72,
      w: 15,
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
      x: 35,
      y: 31,
      w: 22,
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
      x: 34,
      y: 68,
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
      x: 63,
      y: 72,
      w: 11,
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
      x: 15,
      y: 50,
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
      x: 17,
      y: 10,
      w: 14,
      mirrored: 17,
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
      x: 18,
      y: 122,
      w: 16,
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
      x: 15,
      y: 95,
      w: 38,
      spritesheet_rect: [spritesheet.tail]
    },
  },
  {
    name: "codex gigas",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 0,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet["book-1"]]
    },
  },
  {
    name: "the black arts",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 1,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet["book-2"]]
    },
  },
  {
    name: "chicken soup for the teenage devil",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    sprite_data: {
      x: book_x + book_space * 2,
      y: book_y,
      w: book_w,
      spritesheet_rect: [spritesheet["book-3"]]
    },
  },
  {
      name: "Dantes Inferno",
      description: "null",
      cooldown_duration: 2000,
      state: GameEntityState.LOCKED, 
      gain: {
        [Resources.MATURITY]: {
          per_second: 1
        }
      },
      sprite_data: {
        x: book_x + book_space * 3 - 1,
        y: book_y,
        w: book_w + 2,
        spritesheet_rect: [spritesheet["book-5"]]
      },
  },
  // {
  //   name: "The Fault in Our Stars",
  //   description: "null",
  //   cooldown_duration: 2000,
  //   state: GameEntityState.LOCKED, 
  //   gain: {
  //     [Resources.MATURITY]: {
  //       per_second: 1
  //     }
  //   },
  //   sprite_data: {
  //     x: book_x + book_space * 4,
  //     y: book_y,
  //     w: book_w,
  //     spritesheet_rect: [spritesheet["book-5"]]
  //   },
  // },
];