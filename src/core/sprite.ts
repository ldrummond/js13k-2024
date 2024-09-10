import { spritesheet } from "@/spritesheet";
import { pixel_size, spritesheet_img } from "./constants";
import { replaceColor } from "./utils";

// 
export function canvasFromSpritesheet(rect: Rect, canvas_width?: number, canvas_height?: number): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas_width = canvas_width || rect.w;
  canvas_height = canvas_height || rect.h;
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  ctx.imageSmoothingEnabled = false; 
  ctx.drawImage(spritesheet_img, rect.x, rect.y, rect.w, rect.h, 0, 0, canvas_width, canvas_height);
  return {canvas, ctx};
}

// 
export default class Sprite {
  x: number;
  y: number;
  w: number;
  h: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spritesheet_rect: Rect;
  sprite_data: SpriteData;

  constructor(sprite_data: SpriteData) {
    this.spritesheet_rect = sprite_data.spritesheet_rect[0];
    this.sprite_data = sprite_data;
    
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    canvas.width = this.spritesheet_rect.w;
    canvas.height = this.spritesheet_rect.h;

    // Context
    const ctx = canvas.getContext("2d")!;
    this.ctx = ctx;

    // Canvas sizing and position for each sprite
    this.x = sprite_data.x * pixel_size;
    this.y = sprite_data.y * pixel_size;
    this.w = sprite_data.w * pixel_size;
    const rendered_scale_ratio = this.w / this.spritesheet_rect.w; 
    const sprite_aspect = this.spritesheet_rect.h / this.spritesheet_rect.w;
    this.h = this.w * sprite_aspect; // Maintain aspect ratio

    // If mirrored, duplicate base canvas
    if(sprite_data.mirrored) {
      this.w *= 2;
      this.w += sprite_data.mirrored * rendered_scale_ratio;
      canvas.width *= 2;
      canvas.width += sprite_data.mirrored;
    }

    // Draw Image Params
    const source_x = this.spritesheet_rect.x;
    const source_y = this.spritesheet_rect.y;
    const source_w = this.spritesheet_rect.w;
    const source_h = this.spritesheet_rect.h;

    // Draw sprite to canvas
    ctx.drawImage(spritesheet_img, source_x, source_y, source_w, source_h, 0, 0, source_w, source_h);

    // Draw mirrored
    if(sprite_data.mirrored) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0)
      ctx.drawImage(spritesheet_img, source_x, source_y, source_w, source_h, 0, 0, source_w, source_h);
      ctx.restore();
    }
  }

  // 
  render(main_ctx: CanvasRenderingContext2D) {
    main_ctx.drawImage(this.canvas, this.x, this.y, this.w, this.h);
  }
}