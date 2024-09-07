import { spritesheet_img } from "./constants";

export function canvasFromSpritesheet(rect: Rect, canvas_width?: number, canvas_height?: number): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.style.imageRendering = 'pixelated';
  const ctx = canvas.getContext("2d")!;
  canvas_width = canvas_width || rect.w;
  canvas_height = canvas_height || rect.w;
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  ctx.imageSmoothingEnabled = false; 
  ctx.drawImage(spritesheet_img, rect.x, rect.y, rect.w, rect.h, 0, 0, canvas_width, canvas_height);
  return {canvas, ctx};
}

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
    this.spritesheet_rect = sprite_data.spritesheet_rect;
    this.sprite_data = sprite_data;
    
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    canvas.width = this.spritesheet_rect.w;
    canvas.height = this.spritesheet_rect.h;
    const ctx = canvas.getContext("2d")!;
    this.ctx = ctx;

    // Draw canvas for each sprite
    this.x = sprite_data.x;
    this.y = sprite_data.y;
    this.w = sprite_data.w;
    this.h = this.spritesheet_rect.h / this.spritesheet_rect.w * sprite_data.w; // Maintain aspect ratio

    // Draw sprite to canvas
    ctx.drawImage(spritesheet_img, this.spritesheet_rect.x, this.spritesheet_rect.y, this.spritesheet_rect.w, this.spritesheet_rect.h, 0, 0, this.spritesheet_rect.w, this.spritesheet_rect.h);
  }

  // 
  render(main_ctx: CanvasRenderingContext2D) {
    main_ctx.drawImage(this.canvas, this.x, this.y, this.w, this.h);
  }
}