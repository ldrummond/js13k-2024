import { globals, grid_col, grid_row, panel_top_row, pixel_size, Resources, violin_note_frequencies, violin_num_notes, violin_num_octaves } from "@/core/constants";
import { GameEntity } from "@/core/game-entity";
import { spritesheet_data } from "@/data/spritesheet-data";
import { GameEntityState, GameEntityParams } from "@/core/game-entity";
import { playViolinSound } from "@/core/game-audio";
import { arrFull, percentOfRange, ranInt } from "@/core/utils";
import { Animator } from "@/core/animator";

const organ_x = grid_col(1) / pixel_size;
const organ_y = (panel_top_row) / pixel_size;

const violin_y = (panel_top_row + grid_row(4.1)) / pixel_size;

const book_x = 183;
const book_y = (panel_top_row + grid_row(11)) / pixel_size;
const book_w = 17;
const book_space = 27;

////////////////////////////////////////////////
// Organs
////////////////////////////////////////////////
const organs: GameEntityParams[] = [
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
      spritesheet_rects: [spritesheet_data['eye']]
      // For some reason, these names HAVE to be string index, not dot notation, for compilation
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
      spritesheet_rects: [spritesheet_data['pituitary']]
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
      spritesheet_rects: [spritesheet_data['kidney']]
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
      spritesheet_rects: [spritesheet_data['brain']]
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
      spritesheet_rects: [spritesheet_data['lungs']]
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
      spritesheet_rects: [spritesheet_data['bone']]
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
      spritesheet_rects: [spritesheet_data['claw']]
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
      spritesheet_rects: [spritesheet_data['horn'],]
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
      spritesheet_rects: [spritesheet_data['foot']]
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
      spritesheet_rects: [spritesheet_data['tail']]
    },
  },
];

////////////////////////////////////////////////
// Music
////////////////////////////////////////////////

let note_buttons: GameEntityParams[] = [];
const notes_width = 70;
const notes_height = 30;
const default_notes = arrFull(violin_num_notes).map(() => ranInt(violin_num_notes - 1));

// 
for (let r = 0; r < violin_num_octaves; r++) {
  const r_percent = r / violin_num_octaves;
  for (let c = 0; c < violin_num_notes; c++) {
    const c_percent = c / violin_num_notes;
    // const note_hz = percentOfRange(r_percent, 650, 200);
    const note_hz = violin_note_frequencies[r];
    note_buttons.push({
      state: GameEntityState.AVAILABLE, 
      is_selected: !(default_notes[c] === r),
      onClick() {
        playViolinSound(note_hz);

        // Turn off other buttons
        globals.game_entities.map(entity => {
          if(entity?.data?.c == c) {
            entity.is_selected = true;
          }
        });

        (this as GameEntity).is_selected = false;
      },
      sprite_data: {
        id: 'note',
        x: 213 + percentOfRange(c_percent, 0, notes_width),
        y: violin_y + percentOfRange(r_percent, -1, notes_height),
        w: 9,
        spritesheet_rects: [spritesheet_data['note']],
        data: {
          c,
          r,
          hz: note_hz
        }
      },
    });
  }  
}

const note_length = 300;
const music = [ 
  {
    name: "violin",
    description: "null",
    cooldown_duration: note_length * violin_num_notes,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    onClick() {
      const notes_to_play: GameEntity[] = [];
      const selected_notes = globals.game_entities.filter(entity => entity.id.match('note') && !entity.is_selected);

      for (let c = 0; c < violin_num_notes; c++) {
        const col_note = selected_notes.find(note => note?.data?.c == c);  
        if(col_note) notes_to_play.push(col_note);
      }

      new Animator(note_length, violin_num_notes, undefined, (repeats_left) => {
        const note_to_play = notes_to_play[violin_num_notes - repeats_left];
        if(note_to_play) {
          note_to_play.onClick();
          // playViolinSound(note_to_play.data.hz);
        }
      });
    },
    sprite_data: {
      // x: 260,
      x: 180,
      y: violin_y,
      w: 25,
      spritesheet_rects: [spritesheet_data['violin']]
    },
  },
  // Notes
  ...note_buttons
];

////////////////////////////////////////////////
// BOOKS
////////////////////////////////////////////////
const books = [
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
      spritesheet_rects: [spritesheet_data['book1']]
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
      spritesheet_rects: [spritesheet_data['book2']]
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
      spritesheet_rects: [spritesheet_data['book3']]
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
      spritesheet_rects: [spritesheet_data['book5']]
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
      spritesheet_rects: [spritesheet_data['iconPlaying'], spritesheet_data['iconMuted']]
    },
  },
];

export const game_entities_data_list: GameEntityParams[] = [
  ...organs,
  ...music,
  ...books
];