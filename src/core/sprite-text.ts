import { spritesheet_data } from "@/data/spritesheet-data";
import { pixel_size, rgb_white } from "./constants";
import {  dupeCanvas, replaceColor, canvasFromSpritesheet } from "./utils";

/**
 * Char Codes
 * 32 - Space
 * 33 - Exclamation Mark
 * ...
 * 47 - Slash
 * 48 - 0
 * 49 - 1
 * 50 - 2
 * 51 - 3
 * 52 - 4
 * 53 - 5
 * 54 - 6
 * 55 - 7
 * 56 - 8
 * 57 - 9
 * ...
 * 65 - A
 * ...
 * 90 - Z
 * 
 */
function offsetCharCode(code: number): number {
  if(code == 43) code = 0; // +
  if(code == 33) code = 1; // !
  if(code == 63) code = 2; // ?
  if(code > 45 && code < 58) code -= 17; // .,/,0-9,
  if(code > 64 && code < 91) code -= 62; // ?, A-Z
  return code; 
}

// const char_width = 3;
// const char_height = 5;
const char_width = 5;
const char_height = 7;
let init = false; 

//
class SpriteText {
  spritesheet_text_canvas?: HTMLCanvasElement = document.createElement("canvas");
  spritesheet_text_ctx?: CanvasRenderingContext2D;
  color_canvases: {[key: string]: HTMLCanvasElement} = {};

  constructor() {
  }

  init() {
    console.log('Sprite Text Init Src: ', spritesheet_data['textAlt']);
    const [canvas, ctx] = canvasFromSpritesheet(spritesheet_data['textAlt']);
    console.log('Sprite Text Init: ', spritesheet_data['textAlt'], canvas.width, canvas.height);
    this.spritesheet_text_canvas = canvas;
    this.spritesheet_text_ctx = ctx;
  }

  /**
   * 
   * @param ctx 
   * @param text 
   * @param x 
   * @param y 
   * @param size 
   * @param char_space 
   * @param color 
   * @returns 
   */
  fillText(ctx: CanvasRenderingContext2D, text: string, x: number = 0, y: number = 0, size: number = 10, char_space: number = 0.3, line_width?: number, color?: rgb, char_delay?: number): number {
    text = text.toUpperCase();
    x *= pixel_size;
    y *= pixel_size;
    size *= pixel_size;
    const space = char_space * size; 
    let cur_offset = 0;
    let carriage_returns = 0;
    let char_delay_offset = 1;
    
    // Allow for recoloring text
    let canvas = this.spritesheet_text_canvas;
    if(color) canvas = this.getColorCanvas(color);

    let total_offset = 0; 
    text.split('').map((_,i) => {
      const code = text.charCodeAt(i);
      const char_is_space = code == 32;
      const is_period = code == 46; 
      const is_question = code == 63;
  
      // Tighten up ! and . marks
      if(code == 33 || is_period) {
        cur_offset -= (space * 0.8);
      }

      // 0 index characters to align with spritesheet
      const char_source_index = offsetCharCode(code); 

      // Get character from spritesheet
      const source_x = char_source_index * char_width;
      const source_y = 0;
      const source_w = char_width;
      const source_h = char_height;
      const dest_x = x + cur_offset;
      const dest_y = y + carriage_returns * size * 2.5;
      const dest_w = size;
      const dest_h = size * char_height / char_width;

      const drawFn = () => ctx.drawImage(canvas!, 
        source_x, 
        source_y, 
        source_w, 
        source_h, 
        dest_x, 
        dest_y, 
        dest_w, 
        dest_h
      );
      
      // Dont render space
      if(!char_is_space) {
        // Use offset for line length
        cur_offset += size + space;
        
        if(char_delay) {
          char_delay_offset += char_delay;
          setTimeout(drawFn, char_delay_offset);
        }
        else drawFn();
      }
      else {
        cur_offset += (space * 2); 
      }

      if(!line_width) {
        total_offset = cur_offset;
      }
      // Carriage return
      else if(char_is_space && cur_offset > line_width) {
        total_offset += cur_offset;
        cur_offset = 0;
        carriage_returns += 1; 
      }

      // Cadence
      if(char_delay && (is_question || is_period)) {
        char_delay_offset += (char_delay * 5);
      }
    });

    return total_offset;
  }

  /**
   * 
   * @param color 
   * @returns 
   */
  getColorCanvas(color: rgb): HTMLCanvasElement {
    const color_key = "" + color[0] + color[1] + color[2];
    if(this.color_canvases[color_key]) return this.color_canvases[color_key];
    if(!this.spritesheet_text_canvas?.width) console.log('Canvas not defined yet');
    console.log('GetColorCanvas:', this.spritesheet_text_canvas, this.spritesheet_text_canvas?.width, this.spritesheet_text_canvas?.height);
    const [color_canvas, color_ctx] = dupeCanvas(this.spritesheet_text_canvas!);
    replaceColor(color_canvas!, color_ctx, rgb_white, color);
    this.color_canvases[color_key] = color_canvas;
    return color_canvas;
  }
}

export const sprite_text = new SpriteText(); 