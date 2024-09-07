
// Constants format Inspired by Elliot Neilsen 
// https://github.com/elliot-nelson/js13k-2022-moth
import { GameEntity } from "./game-entity";
import { dupeCanvas, htmlFromString, ranInt } from "./utils";

// Resources
export enum Resources {
  "HORMONES",
  "CONFIDENCE",
  "MATURITY",
  "KNOWLEDGE"
}

// Colors
export const hsl_offblack: hsl = [0,0,1];
export const hsl_grey: hsl = [0, 0, 10];
export const hsl_white: hsl = [0, 0, 20];
export const hsl_red: hsl = [9,70,20];

// Constants
export const click_offset = 2;
export const click_duration = 160;
export const tooltip_timeout = 222;
export const dpr = window.devicePixelRatio || 1;

// Dom
export const container = document.getElementById("container") as HTMLElement;
export const main_canvas = document.createElement("canvas");
container.append(main_canvas);
export const main_ctx = main_canvas.getContext("2d")!;
export var canvas_rect = main_canvas.getBoundingClientRect();
export const canvas_width = canvas_rect.width;
export const canvas_height = canvas_rect.height;

// Scale canvas properly
main_canvas.width = canvas_width * dpr;
main_canvas.height = canvas_height * dpr;
main_ctx.scale(dpr, dpr);
main_ctx.imageSmoothingEnabled = false; 

// Pixels
export const hitmask_canvas = dupeCanvas(main_canvas)
export const pixel_count_width = 300;
export const pixel_count_height = Math.ceil(pixel_count_width * 9 / 16);
export const pixel_size = canvas_rect.width / pixel_count_width;

// Sprites
export const spritesheet_img = document.createElement("img");

// Globals
interface Globals {
  is_clicking: boolean;
  hitmask_active_color: string;
  active_message: string;
  hovering_entity?: GameEntity;
  active_entity?: GameEntity;
  mousepos: Point;
}

export const globals: Globals = {
  is_clicking: false,
  hitmask_active_color: '',
  active_message: '',
  active_entity: undefined,
  mousepos: { x: 0, y: 0} as Point
}

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
]

export const resource_map: { [key in Resources]: ResourceDetails} = {
  [Resources.HORMONES]: hormones,
  [Resources.MATURITY]: maturity,
  [Resources.CONFIDENCE]: confidence,
  [Resources.KNOWLEDGE]: knowledge,
}

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
  setTimeout(() => {tooltip_el.remove()}, 2000);
}

// TODO: Remove
// createResourceTooltip(Resources.HORMONES,10, 0);
// createResourceTooltip(Resources.CONFIDENCE,110, 0);
// createResourceTooltip(Resources.KNOWLEDGE,220, 0);
// createResourceTooltip(Resources.MATURITY, 330, 0);