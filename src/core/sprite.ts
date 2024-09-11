import { base_canvas, pixel_size, spritesheet_img } from "./constants";
import { debugLog, dupeCanvas } from "./utils";
import { Animator } from "./animator";
// 
export function canvasFromSpritesheet(rect: Rect, canvas_width?: number, canvas_height?: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const [canvas,ctx] = dupeCanvas(base_canvas);
  canvas_width = canvas_width || rect.w;
  canvas_height = canvas_height || rect.h;
  canvas.width = canvas_width;
  canvas.height = canvas_height;
  ctx.drawImage(spritesheet_img, rect.x, rect.y, rect.w, rect.h, 0, 0, canvas_width, canvas_height);
  return [canvas, ctx];
}

// 

// 
export default class Sprite {
  x: number;
  y: number;
  w: number;
  h: number;
  active_canvas: HTMLCanvasElement;
  sprite_frame_canvases: HTMLCanvasElement[];

  constructor(sprite_data: SpriteData) {
    // Set properties
    const {x, y, w, mirrored, spritesheet_rect: spritesheet_rects, frame_duration} = sprite_data;

    // Canvas sizing and position for each sprite, based on the first frame
    const first_frame_rect = spritesheet_rects[0];
    this.x = x * pixel_size;
    this.y = y * pixel_size;
    this.w = w * pixel_size;
    const rendered_scale_ratio = this.w / first_frame_rect.w; 
    const sprite_aspect = first_frame_rect.h / first_frame_rect.w;
    this.h = this.w * sprite_aspect; // Maintain aspect ratio

    // Create a canvas for each frame, if animating
    const frame_canvases_ctxs: [HTMLCanvasElement, CanvasRenderingContext2D][] = spritesheet_rects.map(spritesheet_rect => {
      // Create canvas
      const [canvas, ctx] = canvasFromSpritesheet(spritesheet_rect);
  
      // If mirrored, duplicate base canvas
      if(mirrored) {
        this.w *= 2;
        this.w += mirrored * rendered_scale_ratio;
        canvas.width *= 2;
        canvas.width += mirrored;
      }
  
      // Draw Image Params
      const source_x = spritesheet_rect.x;
      const source_y = spritesheet_rect.y;
      const source_w = spritesheet_rect.w;
      const source_h = spritesheet_rect.h;
  
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
    debugLog(this.active_canvas);
    main_ctx.drawImage(this.active_canvas, this.x, this.y, this.w, this.h);
  }
}