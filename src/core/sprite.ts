import { pixel_size, spritesheet_img } from "./constants";
import {  ranInt, canvasFromSpritesheet } from "./utils";
import { Animator } from "./animator";

// 
export interface SpriteData {
  id?: string;
  x: number;
  y: number;
  w: number;
  mirrored?: number;
  spritesheet_rects: Rect[];
  frame_duration?: number;
  data?: any;
}

// 
export default class Sprite {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  active_canvas: HTMLCanvasElement;
  sprite_frame_canvases: HTMLCanvasElement[];
  data: any = {};

  constructor(sprite_data: SpriteData) {
    // Set properties
    const {id, x, y, w, mirrored, spritesheet_rects, frame_duration, data} = sprite_data;
    this.id = id || ranInt(100) + '';
    this.data = data; 

    // Canvas sizing and position for each sprite, based on the first frame
    const first_frame_rect = spritesheet_rects[0];
    this.x = x * pixel_size;
    this.y = y * pixel_size;
    this.w = w * pixel_size;

    const rendered_scale_ratio = this.w / first_frame_rect['w']; 
    const sprite_aspect = first_frame_rect['h'] / first_frame_rect['w'];
    this.h = this.w * sprite_aspect; // Maintain aspect ratio

    // Create a canvas for each frame, if animating
    const frame_canvases_ctxs: [HTMLCanvasElement, CanvasRenderingContext2D][] = spritesheet_rects.map(rect => {
      // Create canvas
      const [canvas, ctx] = canvasFromSpritesheet(rect);
      // document.body.append(canvas);
  
      // If mirrored, duplicate base canvas
      if(mirrored) {
        this.w *= 2;
        this.w += mirrored * rendered_scale_ratio;
        canvas.width *= 2;
        canvas.width += mirrored;
      }
  
      // Draw Image Params
      const source_x = rect['x'];
      const source_y = rect['y'];
      const source_w = rect['w'];
      const source_h = rect['h'];
  
      // Draw mirrored
      if(sprite_data.mirrored) {
        ctx.drawImage(spritesheet_img, source_x, source_y, source_w, source_h, 0, 0, source_w, source_h);
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(spritesheet_img, source_x, source_y, source_w, source_h, 0, 0, source_w, source_h);
        ctx.restore();
      }

      return [canvas, ctx];
    });

    // Set first frame
    this.sprite_frame_canvases = frame_canvases_ctxs.map(arr => arr[0]);
    this.active_canvas = this.sprite_frame_canvases[0];
    // this.ctx = frame_canvases_ctxs[0][1];

    // If animating
    if(frame_duration) {
      // Negative repeat count = infinite
      new Animator(frame_duration, -1, undefined, () => {
        this.active_canvas = this.sprite_frame_canvases.next();
      });
    }
  }

  // 
  render(main_ctx: CanvasRenderingContext2D) {
    main_ctx.drawImage(this.active_canvas, this.x, this.y, this.w, this.h);
  }
}