
// Constants format Inspired by Elliot Neilsen 
// https://github.com/elliot-nelson/js13k-2022-moth
import { spritesheet_data } from "@/data/spritesheet-data";
import { Animator } from "./animator";
import { GameEntity } from "./game-entity";
import Sprite from "./sprite";
import { UIText } from "./ui-text";
import { dupeCanvas, fillRectWithRandom } from "./utils";

// Overrites
declare global {
  interface Array<T> {
    next(): T;
    removeElement(e: T): void;
    _curIdx: number
  }
}

/**
 * 
 */
Array.prototype._curIdx = 0;
Array.prototype.next = function() {
  this._curIdx = (this._curIdx + 1) % this.length;
  return this[this._curIdx];
};
Array.prototype.removeElement = function<T>(e: T): void {
  const index = this.indexOf(e);
  if (index > -1) this.splice(index, 1);
};

// Resources
export const enum Resources {
  "HORMONES",
  "MATURITY",
  "CONFIDENCE",
  "KNOWLEDGE"
}

// Colors
// TODO: HSL or RGB, probably RBG
export const hsl_offblack: hsl = [0,0,1];
export const hsl_grey: hsl = [2, 2, 22];
export const hsl_white: hsl = [0, 0, 20];
export const hsl_red: hsl = [9,70,20];
export const hsl_darkred: hsl = [8,65,15];
export const hsl_darkgrey: hsl = [2,2,9];
export const hsl_darkgreen: hsl = [164,38,5];
export const hsl_lightgrey: hsl = [0,0,28];
export const hsl_blue: hsl = [230, 80, 40];
export const hsl_gold: hsl = [51,97,31];

export const rgb_darkgreen: rgb = [8,18,15];
export const rgb_darkgrey: rgb = [20,20,20];
export const rgb_lightgrey: rgb = [100,100,100];
export const rgb_grey: rgb = [26,26,26];
export const rgb_offblack: rgb = [3,3,3];
export const rgb_white: rgb = [255,255,255];
export const rgb_offwhite: rgb = [150, 150, 150];
export const rgb_gold: rgb = [155,132,2];
export const rgb_brown: rgb = [93,52,52];
export const rgb_red: rgb = [180,49,67];
export const rgb_darkred: rgb = [140, 40, 54];
export const rgb_rust: rgb = [111, 39, 50];

export const sprite_border_color: rgb = rgb_brown;
export const sprite_border_hover_color: rgb = rgb_darkred;
export const sprite_purchased_limit_color: rgb = rgb_rust;
export const sprite_too_expensive_border_color: rgb = rgb_white;

// Define Constants
// export const fps = 50;
export const fps = 30;
export const interval = 1000 / fps; 
export const pi = 3.14;
export const twopi = pi * 2;
export const halfpi = pi / 2;
export const qrtrpi = pi / 4;
export const roottwo = Math.sqrt(2);
export const click_offset = 2;
export const click_duration = 160;
export const tooltip_timeout = 200;
export const dpr = window.devicePixelRatio || 1;
export const window_width = window.innerWidth;
export const window_height = window.innerHeight;

export const violin_num_notes = 6;
export const violin_num_octaves = 6;
export const violin_note_frequencies: { [key: number]: number } = [
  392.00,  // G4
  329.63, // E4
  293.66, // D4
  246.94, // B3
  220.00, // A3
  196.00, // G3
];;

// First, start loading sprites
// Sprites
export const spritesheet_img = document.createElement("img");
spritesheet_img.src = "spritesheet.png";

// Set Up Container
const container_aspect_ratio = 12 / 9;
const [container_width, container_height] = (
  window_width / container_aspect_ratio > window_height ? [window_height * container_aspect_ratio, window_height] : [window_width, window_width / container_aspect_ratio]
);
export {container_width, container_height};

// Define grid
export const grid_col = (v: number) => v * container_width / 24;
export const grid_row = (v: number) => v * container_height / 24; 

// Pixels
export const pixel_count_width = 300;
export const pixel_count_height = Math.ceil(pixel_count_width * 9 / 16);
export const pixel_size = container_width / pixel_count_width;

// Footer
export const panel_top_row = grid_row(3.5);
export const footer_y = grid_row(21.75) / pixel_size;
export const footer_x = (grid_col(1) + 5) / pixel_size;
export const footer_space = (grid_col(25.5) - footer_x) / 4 / pixel_size;

// Character
export const char_x = grid_col(7);
export const char_y = panel_top_row + grid_row(1.5);
export const char_w = grid_col(6.5);
export const char_h = grid_row(13);
export const char_border_inset = 2.5 * pixel_size;

// Minion
export const minion_x = grid_col(1);
export const minion_y = grid_row(0.75); 
export const minion_width = grid_col(22);
export const minion_height = grid_row(1.5);
export const minion_lines = {
  "start": "See that little runt? He just turned 13 and is starting puberty.",
  "encourage": "He needs a bit of a nudge. Click the brain to get his hormones pumping.",
  "brain_clicked": "Nice! Look at him squirm. Get more hormones and grow that pituitary.",
  "kidney": "Hmm not sure what that does.",
  "violin0": "What is this novel form of torture!?",
  "violin1": "Agh! The agony!",
  "violin2": "What horrible sounds!",
  "violin3": "Where did you get this evil device!?",
  "violin4": "No amount of practice will be enough!",
  "studies": "Keep studying. The devil is in the details. He he"
};

// Dom
export const base_canvas = document.createElement("canvas")!;
base_canvas.width = window_width;
base_canvas.height = window_height;

// Fill the background
export const [loading_canvas, loading_ctx] = dupeCanvas(base_canvas);
loading_canvas.id = 'loading';
loading_canvas.classList.add("fill");
document.body.append(loading_canvas);
fillRectWithRandom(loading_ctx, 0, 0, window_width, window_height, hsl_offblack);

// Page Stage
export const container = document.createElement("div"); 
container.style.width = container_width + 'px';
container.style.height = container_height + 'px';
container.id = 'container';
container.innerHTML = `<div id="text"></div><div id="footer"></div>`;
document.body.prepend(container);

// Scale canvas properly
export const [main_canvas, main_ctx] = dupeCanvas(base_canvas);
main_canvas.id = 'main';
container.append(main_canvas);
main_canvas.width = container_width * dpr;
main_canvas.height = container_height * dpr;
main_ctx.scale(dpr, dpr);
main_ctx.imageSmoothingEnabled = false;

// Rem Scale
document.documentElement.style.fontSize = (pixel_size * 4) + 'px';

// Hitmask
export const [hitmask_canvas] = dupeCanvas(main_canvas);

// Globals
interface Globals {
  is_clicking: boolean;
  hitmask_active_color: string;
  hovering_entity?: GameEntity;
  active_entity?: GameEntity;
  mousepos: Point;
  volume: number;
  cursor: CSSStyleDeclaration['cursor'];
  elapsed: number;
  sprites: Sprite[];
  game_entities: GameEntity[];
  animators: Animator[];
  minion_text: string;
  ui_text?: UIText,
}

export const globals: Globals = {
  is_clicking: false,
  hitmask_active_color: '',
  active_entity: undefined,
  mousepos: { x: 0, y: 0} as Point,
  volume: 1,
  cursor: "default",
  elapsed: 0,
  sprites: [],
  game_entities: [],
  animators: [],
  minion_text: '',
};

export const hormones: ResourceDetails = {
  name: "hormones",
  type: Resources.HORMONES,
  icon_rect: spritesheet_data['iconHormones'],
  placeholder_char: '{',
  quantity: 100,
  limit: 100,
  increase_per_second: 0,
  locked_state: false,
  should_unlock: () => true
};

export const confidence: ResourceDetails = {
  name: "confidence",
  type: Resources.CONFIDENCE,
  icon_rect: spritesheet_data['iconCoin'],
  placeholder_char: '}',
  quantity: 0,
  limit: 10,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

export const maturity: ResourceDetails = {
  name: "maturity",
  type: Resources.MATURITY,
  icon_rect: spritesheet_data['iconHorn'],
  placeholder_char: '|',
  quantity: 0,
  limit: 20,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

export const knowledge: ResourceDetails = {
  name: "knowledge",
  type: Resources.KNOWLEDGE,
  icon_rect: spritesheet_data['iconScroll'],
  placeholder_char: '~',
  quantity: 0,
  limit: 4,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

// Placeholder char for eye
export const icon_eye_placeholder_char = '^';

export const resource_list: ResourceDetails[] = [
  hormones,
  maturity,
  confidence,
  knowledge
];

export const resource_map: { [key in Resources]: ResourceDetails} = {
  [Resources.HORMONES]: hormones,
  [Resources.MATURITY]: maturity,
  [Resources.CONFIDENCE]: confidence,
  [Resources.KNOWLEDGE]: knowledge,
};
