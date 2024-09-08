import { spritesheet } from "@/spritesheet";
import { canvasFromSpritesheet } from "./sprite";
import { pixel_size, rgb_white, spritesheet_img } from "./constants";
import { replaceColor } from "./utils";

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
  if(code == 33) code = 11; // !
  if(code == 63) code = 12; // !
  if(code > 46 && code < 58) code -= 47; // /,0-9,
  if(code > 64 && code < 91) code -= 52; // ?, A-Z
  return code; 
}

const char_width = 3;
const char_height = 5;

//
class SpriteText {
  spritesheet_text_canvas?: HTMLCanvasElement;
  spritesheet_text_ctx?: CanvasRenderingContext2D;

  init() {
    const {canvas: spritesheet_text_canvas, ctx: spritesheet_text_ctx} = canvasFromSpritesheet(spritesheet.text);
    this.spritesheet_text_canvas = spritesheet_text_canvas;
    this.spritesheet_text_ctx = spritesheet_text_ctx;

    // TODO: Remove
    // Debug
    // const test_canvas = document.createElement("canvas");
    // test_canvas.width = 1000;
    // test_canvas.height = 200;
    // test_canvas.style.background = 'blue';
    // document.body.append(test_canvas);
    // const test_ctx = test_canvas.getContext("2d")!;
    // test_ctx.scale(2, 2);
    // test_ctx.imageSmoothingEnabled = false;
    // test_canvas.style.position = 'absolute';
    // test_canvas.style.left = '0';
    // test_canvas.style.bottom = '0';
    // this.fillText(test_ctx, "Hello! How are you?", 0, 0);
  }

  fillText(ctx: CanvasRenderingContext2D, text: string, x: number = 0, y: number = 0, size: number = 10, char_space: number = 0.3, color?: rgb) {
    text = text.toUpperCase();
    size *= pixel_size;
    const space = char_space * size; 
    
    if(color) {
      replaceColor(this.spritesheet_text_canvas!, this.spritesheet_text_ctx!, rgb_white, color);
    }

    let offset = 0; 
    text.split('').map((_,i) => {
      const code = text.charCodeAt(i);
      
      // Dont render Space
      if(code == 32) {
        offset += (space * 2); 
        return;
      }
      
      // Tighten up ? and ! marks
      if(code == 33) {
        offset -= (space * 0.7);
      }

      // 0 index characters to align with spritesheet
      const char_source_index = offsetCharCode(code); 

      // Get character from spritesheet
      const source_x = char_source_index * char_width;
      const source_y = 0;
      const source_w = char_width;
      const source_h = char_height;
      const dest_x = x + offset;
      const dest_y = y;
      const dest_w = size;
      const dest_h = size * char_height / char_width;

      ctx.drawImage(this.spritesheet_text_canvas!, 
        source_x, 
        source_y, 
        source_w, 
        source_h, 
        dest_x, 
        dest_y, 
        dest_w, 
        dest_h
      );

      // Use offset for line length
      offset += size + space;
    });

    if(color) {
      replaceColor(this.spritesheet_text_canvas!, this.spritesheet_text_ctx!, color, rgb_white);
    }
  }
}

export const sprite_text = new SpriteText(); 