import { footer_space, footer_x, footer_y, globals, grid_col, grid_row, minion_lines, panel_top_row, pixel_size, Resources, violin_note_frequencies, violin_num_notes, violin_num_octaves } from "@/core/constants";
import { GameEntity } from "@/core/game-entity";
import { spritesheet_data } from "@/data/spritesheet-data";
import { GameEntityState, GameEntityParams } from "@/core/game-entity";
import { playCreepyAmbience, playMysteriousWhisper, playViolinSound, playWetSquelch } from "@/core/game-audio";
import { arrFull, arrRan, getEntityByName, percentOfRange, ranInt } from "@/core/utils";
import { Animator } from "@/core/animator";
import { drawEndFrame } from "@/core/endframe";

const organ_x = grid_col(1) / pixel_size;
const organ_y = (panel_top_row) / pixel_size;

const violin_y = (panel_top_row + grid_row(4.1)) / pixel_size;

const book_x = 183;
const book_y = (panel_top_row + grid_row(11.2)) / pixel_size;
const book_w = 17;
const book_space = 27;

////////////////////////////////////////////////
// Organs
////////////////////////////////////////////////
const organs: GameEntityParams[] = [
  {
    name: "evil eye",
    // description: "the final evolution",
    state: GameEntityState.AVAILABLE,
    cost: {
      [Resources.HORMONES]: {
        quantity: 300,
      },
      [Resources.MATURITY]: {
        quantity: 60,
      },
      [Resources.CONFIDENCE]: {
        quantity: 25
      },
      [Resources.KNOWLEDGE]: {
        quantity: 5
      }
    },
    gain: {
   
    },
    onPurchase() {
      playCreepyAmbience();
      drawEndFrame();
    },
    purchase_limit: 1,
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
    name: "grow pituitary",
    // description: "starts hormone production.",
    cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE,
    cost: {
      [Resources.HORMONES]: {
        quantity: 60
      }
    },
    gain: {
      [Resources.HORMONES]: {
        per_second: .5,
        limit: 5
      }
    },
    onPurchase() {
      if(this.cost) {
        const hormones_cost = this.cost[Resources['HORMONES']];
        if(hormones_cost?.quantity) hormones_cost.quantity += 35;
      }

      if((this as GameEntity).purchase_count == 1) {
        globals.ui_text?.updateMinionText(minion_lines['jerk']);

        const kidney = getEntityByName('form kidney');
        kidney?.becomeAvailable();

        const horns = getEntityByName('sharpen horns');
        horns?.becomeAvailable();
      }
    },
    purchase_limit: 5,
    sprite_data: {
      x: organ_x + 30,
      y: organ_y + 50,
      w: 10,
      spritesheet_rects: [spritesheet_data['pituitary']]
    },
  },
  {
    name: "form kidney",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED,
    cost: {
      [Resources.HORMONES]: {
        quantity: 100
      }
    },
    gain: {
      [Resources.HORMONES]: {
        limit: 10
      },
    },
    onPurchase() {
      if(this.cost) {
        const hormones_cost = this.cost[Resources['HORMONES']];
        if(hormones_cost?.quantity) hormones_cost.quantity += 10;
      }

      if((this as GameEntity).purchase_count == 1) {
        globals.ui_text?.updateMinionText(minion_lines['kidney']);
      }

    },
    purchase_limit: 2,
    sprite_data: {
      x: organ_x + 5,
      y: organ_y + 72,
      w: 16,
      spritesheet_rects: [spritesheet_data['kidney']]
    },
  },
  {
    name: "exercise brain",
    // description: "The root of all evil",
    cooldown_duration: 800,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.HORMONES]: {
        quantity: 9
      }
    },
    onPurchase() {
      if((this as GameEntity).purchase_count == 1) {
        globals.ui_text?.updateMinionText(minion_lines['brain_clicked']);
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
    cooldown_duration: 1000,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources.HORMONES]: {
        quantity: 50,
      }
    },
    gain: {
      [Resources.MATURITY]: {
        quantity: 2
      },
      [Resources.CONFIDENCE]: {
        quantity: 0.5
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
    name: "growth spurt",
    cooldown_duration: 12000,
    purchase_limit: 6,
    state: GameEntityState.LOCKED,
    cost: {
      [Resources.MATURITY]: {
        quantity: 20
      },
      [Resources.CONFIDENCE]: {
        quantity: 2,
      }
    }, 
    gain: {
      [Resources.HORMONES]: {
        limit: 10
      },
      [Resources.MATURITY]: {
        limit: 5
      }
    },
    onPurchase() {
      if(this.cost) {
        const maturity_cost = this.cost[Resources['MATURITY']];
        if(maturity_cost?.quantity) maturity_cost.quantity += 5;
        const confidence_cost = this.cost[Resources['CONFIDENCE']];
        if(confidence_cost?.quantity) confidence_cost.quantity += 2;
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
    name: "grow claws",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    purchase_limit: 3,
    cost: {
      [Resources.HORMONES]: {
        quantity: 120,
        per_second: .1
      },
      [Resources.MATURITY]: {
        quantity: 20,
      }
    },
    gain: {
      [Resources.MATURITY]: {
        per_second: .6
      }
    },
    onPurchase() {
      if((this as GameEntity).purchase_count == 1) {
        globals.ui_text?.updateMinionText(minion_lines['claws']);

        const violin = getEntityByName('practice violin');
        violin?.becomeAvailable();
      }

      if(this.cost) {
        const hormones_cost = this.cost[Resources['HORMONES']];
        const maturity_cost = this.cost[Resources['MATURITY']];
        if(hormones_cost?.per_second) hormones_cost.per_second += .1;
        if(maturity_cost?.quantity) maturity_cost.quantity += 5; 
      }
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
    name: "sharpen horns",
    cooldown_duration: 5000,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources['HORMONES']]: {
        quantity: 120
      }
    },
    gain: {
      [Resources['MATURITY']]: {
        per_second: .2
      }
    },
    onPurchase() {
      if((this as GameEntity).purchase_count == 1) {
        const claws = getEntityByName('grow claws');
        claws?.becomeAvailable();

        const hooves = getEntityByName('shape hooves');
        hooves?.becomeAvailable();
      }
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
    name: "shape hooves",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources.HORMONES]: {
        quantity: 90
      },
      [Resources.MATURITY]: {
        quantity: 25
      },
      [Resources.CONFIDENCE]: {
        quantity: 5
      } 
    },
    gain: {
      [Resources.HORMONES]: {
        limit: 50,
      },
      [Resources.MATURITY]: {
        limit: 5
      }
    },
    purchase_limit: 2,
    onPurchase() {
      // TODO: Unlock bone
      
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
    name: "grow tail",
    cooldown_duration: 9000,
    state: GameEntityState.LOCKED,
    purchase_limit: 3,
    cost: {
      [Resources.HORMONES]: {
        quantity: 200
      },
      [Resources.MATURITY]: {
        per_second: 0.5
      },
      [Resources.CONFIDENCE]: {
        quantity: 5,
      }
    },
    gain: {
      [Resources.CONFIDENCE]: {
        per_second: 0.1,
        limit: 2
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

// Add audio
organs.map(organ_params => {
  organ_params.clickSoundFn = playMysteriousWhisper;
});

////////////////////////////////////////////////
// Music
////////////////////////////////////////////////

let note_buttons: GameEntityParams[] = [];
const notes_width = 70;
const notes_height = 29;
const default_notes = arrFull(violin_num_notes).map(() => ranInt(violin_num_notes - 1));
const note_length = 400;

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
        (this as GameEntity).became_available = true;
        setTimeout(() => {
          (this as GameEntity).became_available = false;
        }, 111);
      },
      sprite_data: {
        id: 'note',
        x: 213 + percentOfRange(c_percent, 0, notes_width),
        y: violin_y + percentOfRange(r_percent, 1, notes_height),
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

const music = [ 
  {
    name: "practice violin",
    cooldown_duration: note_length * violin_num_notes,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources.HORMONES]: {
        quantity: 50
      },
      [Resources.MATURITY]: {
        per_second: .2, 
        quantity: 25,
      }
    },
    gain: {
      [Resources.CONFIDENCE]: {
        quantity: 1
      }
    },
    onPurchase() {
      const violin_texts = [
        minion_lines['violin0'],
        minion_lines['violin1'],
        minion_lines['violin2'],
        minion_lines['violin3'],
        minion_lines['violin4']
      ];
      globals.ui_text?.updateMinionText(arrRan(violin_texts));

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
const books: GameEntityParams[] = [
  {
    name: "codex gigas",
    state: GameEntityState.AVAILABLE, 
    purchase_limit: 1,
    cost: {
      [Resources.HORMONES]: {
        quantity: 150
      },
      [Resources.MATURITY]: {
        quantity: 15
      },
      [Resources.CONFIDENCE]: {
        quantity: 5
      }
    },
    gain: {
      [Resources.HORMONES]: {
        per_second: 2
      },
      [Resources.KNOWLEDGE]: {
        quantity: 1
      },
    },
    onPurchase() {
      // Unlock lungs
      const lungs = getEntityByName('lungs');
      lungs?.becomeAvailable();

      // Unlock next book
      const black_arts = getEntityByName('the black arts');
      black_arts?.becomeAvailable();

      const bones = getEntityByName('growth spurt');
      bones?.becomeAvailable();

      globals.ui_text?.updateMinionText(minion_lines['studies']);
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
    state: GameEntityState.LOCKED, 
    purchase_limit: 1,
    cost: {
      [Resources.HORMONES]: {
        quantity: 220
      },
      [Resources.MATURITY]: {
        quantity: 30
      },
      [Resources.CONFIDENCE]: {
        quantity: 6
      }
    },
    gain: {
      [Resources.CONFIDENCE]: {
        per_second: 0.2,
      },
      [Resources.KNOWLEDGE]: {
        quantity: 2
      },
    },
    onPurchase() {
      // Unlock next book
      const dantes = getEntityByName('dantes inferno');
      dantes?.becomeAvailable();

      const tail = getEntityByName('grow tail');
      tail?.becomeAvailable();
    },
    sprite_data: {
      x: book_x + book_space * 1,
      y: book_y,
      w: book_w,
      spritesheet_rects: [spritesheet_data['book2']]
    },
  },
  {
    name: "dantes inferno",
    purchase_limit: 1,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources.HORMONES]: {
        quantity: 200
      },
      [Resources.MATURITY]: {
        quantity: 30
      },
      [Resources.CONFIDENCE]: {
        quantity: 15
      }
    },
    gain: {
      [Resources.CONFIDENCE]: {
        limit: 10
      },
      [Resources.KNOWLEDGE]: {
        quantity: 1
      }
    },
    onPurchase() {
      // Unlock next book
      const advice = getEntityByName('advice for a teenage devil');
      advice?.becomeAvailable();
    },
    sprite_data: {
      x: book_x + book_space * 2,
      y: book_y,
      w: book_w,
      spritesheet_rects: [spritesheet_data['book3']]
    },
  },
  {
    name: "advice for a teenage devil",
    purchase_limit: 1,
    state: GameEntityState.LOCKED, 
    cost: {
      [Resources.HORMONES]: {
        quantity: 300
      },
      [Resources.MATURITY]: {
        quantity: 50
      },
      [Resources.CONFIDENCE]: {
        quantity: 25
      }
    },
    gain: {
      [Resources.KNOWLEDGE]: {
        quantity: 2
      }
    },
    onPurchase() {
      // Unlock eye
      const eye = getEntityByName('evil eye');
      eye?.becomeAvailable();

      globals.ui_text?.updateMinionText(minion_lines['advice']);
    },
    sprite_data: {
      x: book_x + book_space * 3 - 1,
      y: book_y,
      w: book_w + 2,
      spritesheet_rects: [spritesheet_data['book5']]
    },
  },
  {
    name: "MUTE",
    state: GameEntityState.AVAILABLE, 
    onClick() {
      const self = this as GameEntity;
      globals.volume = 1 - globals.volume;
      self.active_interactive_canvases = self.sprite_frames_interactive_canvases.next();
      globals.volume === 0 ? this.name = 'UNMUTE' : this.name = 'MUTE';
    },
    sprite_data: {
      x: 275,
      y: 11,
      w: 10,
      spritesheet_rects: [spritesheet_data['iconPlaying'], spritesheet_data['iconMuted']]
    },
  },
];

// Add audio
books.map(book_params => {
  book_params.clickSoundFn = playWetSquelch;
});

////////////////////////////////////////////////
// ICONS
////////////////////////////////////////////////
const icon_width = 10;
const icon_y = footer_y - icon_width / 2;

const icons: GameEntityParams[] = [
  {
    name: "Hormones",
    state: GameEntityState.AVAILABLE,
    sprite_data: {
      x: footer_x + footer_space * 0,
      y: icon_y,
      w: icon_width,
      spritesheet_rects: [spritesheet_data['iconHormones']]
    }
  },
  {
    name: "Maturity",
    state: GameEntityState.AVAILABLE,
    sprite_data: {
      x: footer_x + footer_space * 1,
      y: icon_y,
      w: icon_width,
      spritesheet_rects: [spritesheet_data['iconHorn']]
    }
  },
  {
    name: "Confidence",
    state: GameEntityState.AVAILABLE,
    sprite_data: {
      x: footer_x + footer_space * 2,
      y: icon_y,
      w: icon_width,
      spritesheet_rects: [spritesheet_data['iconCoin']]
    }
  },
  {
    name: "Knowledge",
    state: GameEntityState.AVAILABLE,
    sprite_data: {
      x: footer_x + footer_space * 3,
      y: icon_y,
      w: icon_width,
      spritesheet_rects: [spritesheet_data['iconScroll']]
    }
  },
];

export const game_entities_data_list: GameEntityParams[] = [
  ...organs,
  ...music,
  ...books,
  ...icons,
  // Volume buttons
  
];