
// Constants format Inspired by Elliot Neilsen 
// https://github.com/elliot-nelson/js13k-2022-moth
import { Animator } from "./animator";
import { GameEntity } from "./game-entity";
import Sprite from "./sprite";
import { dupeCanvas, fillRectWithRandom, htmlFromString } from "./utils";

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
export enum Resources {
  "HORMONES",
  "CONFIDENCE",
  "MATURITY",
  "KNOWLEDGE"
}

// Colors
// TODO: HSL or RGB, probably RBG
export const hsl_offblack: hsl = [0,0,1];
export const hsl_grey: hsl = [0, 0, 10];
export const hsl_white: hsl = [0, 0, 20];
export const hsl_red: hsl = [9,70,20];
export const hsl_darkred: hsl = [8,65,15];
export const hsl_lightgrey: hsl = [0,0,20];
export const hsl_blue: hsl = [230, 80, 40];

export const rgb_lightgrey: rgb = [50,50,50];
export const rgb_grey: rgb = [26,26,26];
export const rgb_offblack: rgb = [3,3,3];
export const rgb_white: rgb = [255,255,255];
export const rgb_gold: rgb = [155,132,2];
export const rgb_brown: rgb = [93,52,52];

export const sprite_border_color: rgb = rgb_brown;
export const sprite_border_hover_color: rgb = [180,49,67];

// Define Constants
export const fps = 50;
export const interval = 1000 / fps; 
export const pi = 3.14;
export const halfpi = pi / 2;
export const twopi = pi * 2;
export const click_offset = 2;
export const click_duration = 160;
export const tooltip_timeout = 222;
export const dpr = window.devicePixelRatio || 1;
export const window_width = window.innerWidth || 1;
export const window_height = window.innerHeight || 1;
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
export const panel_top_row = grid_row(3);
export const footer_y = grid_row(21) / pixel_size;
export const footer_x = (grid_col(1) + 20) / pixel_size;
export const footer_space = (grid_col(24) - footer_x) / 4 / pixel_size;

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
loading_ctx.imageSmoothingEnabled = false;

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
  active_message: string;
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
}

export const globals: Globals = {
  is_clicking: false,
  hitmask_active_color: '',
  active_message: '',
  active_entity: undefined,
  mousepos: { x: 0, y: 0} as Point,
  volume: 1,
  cursor: "default",
  elapsed: 0,
  sprites: [],
  game_entities: [],
  animators: [],
  minion_text: ''
};

export const hormones: ResourceDetails = {
  name: "hormones",
  type: Resources.HORMONES,
  icon: `<path d="M35 32.6C35 38.4 30.5 43 25 43s-10-4.6-10-10.4c0-1.3.6-3.6 1.7-6.4a118.9 118.9 0 0 1 7.5-16.5l.8-1.6a240.8 240.8 0 0 1 8.3 18c1 2.9 1.7 5.2 1.7 6.5Z"/>`,
  quantity: 0,
  limit: 100,
  increase_per_second: 0,
  locked_state: false,
  should_unlock: () => true
};

export const confidence: ResourceDetails = {
  name: "confidence",
  type: Resources.CONFIDENCE,
  icon: `<path d="m22 9 8 3c3 1 6 3 7 5 5 8 3 18-4 22-3 2-7 2-10 2a16 16 0 0 1-8-30 21 21 0 0 1 7-2Z"/><circle cx="27.1" cy="24" r="16"/><path d="M27 8v31M38 24a21 21 0 0 1-3 2c-2 1-5 3-8 3s-6-2-8-3a23 23 0 0 1-3-2 20 20 0 0 1 3-2c2-1 5-3 8-3s6 2 8 3a23 23 0 0 1 3 2Z"/><ellipse cx="26.9" cy="24.1" rx="2.8" ry="4.7"/>`,
  quantity: 0,
  limit: 10,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

export const maturity: ResourceDetails = {
  name: "maturity",
  type: Resources.MATURITY,
  icon: `<path d="m20.4 23.5-9-3.7 7.3-12 1.3 7.4v.7l.7.1L32 19.5l-2.9 7.9-.4 1 1 .3 9 2.7L35 44H22.9l2.7-7.7.3-.9-.9-.3-7-2.7 3-7.6.3-1-1-.3Z"/>`,
  quantity: 0,
  limit: 20,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

export const knowledge: ResourceDetails = {
  name: "knowledge",
  type: Resources.KNOWLEDGE,
  icon: `<rect width="24" height="8" x="7" y="8" rx="4"/><path d="M13 8h21a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V8Z"/><path d="M18 34h21a4 4 0 0 1 0 8H18v-8Z"/><path d="M17 42a4 4 0 0 0 0-8m-4-22c0-2.2-.9-4-2-4"/><circle cx="17" cy="38" r="3"/>`,
  quantity: 0,
  limit: 5,
  increase_per_second: 0,
  locked_state: true,
  should_unlock: () => false
};

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

export function createIconSvg(path: string) {
  return htmlFromString(`<svg viewBox='0 0 50 50'>${path}</svg>`);
}

export function createResourceTooltip(resource: Resources, x: number, y: number) {
  const icon = createIconSvg(resource_map[resource].icon);
  const tooltip_el = htmlFromString(`<div class='resource-gain'></div>`) as HTMLElement;
  tooltip_el.append(icon);
  tooltip_el.style.left = x + 'px';
  tooltip_el.style.top = y + 'px';
  container.append(tooltip_el);
  setTimeout(() => {tooltip_el.remove();}, 2000);
}

// TODO: Remove
// createResourceTooltip(Resources.HORMONES,10, 0);
// createResourceTooltip(Resources.CONFIDENCE,110, 0);
// createResourceTooltip(Resources.KNOWLEDGE,220, 0);
// createResourceTooltip(Resources.MATURITY, 330, 0);