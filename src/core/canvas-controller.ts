import { 
  main_ctx,
  canvas_width,
  canvas_height,
  pixel_count_width,
  pixel_count_height,
  pixel_size,
  hsl_grey,
  hsl_offblack,
  hsl_red,
  hsl_white,
  main_canvas,
  dpr,
  container,
} from "./constants";
import { dupeCanvas, fillCanvasWithRandomPixels, ranHSL, roundToPixel } from "./utils";

/**
 * Paul Lewis, High DPI Canvas
 * https://web.dev/articles/canvas-hidipi
 * TODO: Resizable canvas
 */
class DrawEngine {
  constructor() {
    // const pattern = createPattern(undefined, undefined, undefined, undefined, 100, 0, 50, undefined, undefined, undefined);

    // const test_canvas = document.createElement("canvas");
    // test_canvas.width = 100;
    // test_canvas.height = 100;
    // // container.append(test_canvas); 
    // // test_canvas.style.zIndex = 100;
    // test_canvas.style.imageRendering = "pixelated";
    // const text_context = test_canvas.getContext("2d")!;
    // // text_context.lineWidth = 3;
    // text_context.fillStyle = pattern;
    // // text_context.strokeStyle = pattern_stroke;
    // text_context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    // // text_context.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    // this.context.drawImage(test_canvas, 0, 0, 200, 200);

    const background_canvas = dupeCanvas(main_canvas);
    const background_ctx = background_canvas.getContext("2d")!;
    background_ctx.scale(dpr, dpr);
    container.prepend(background_canvas);

    // Draw Background Layer
    fillCanvasWithRandomPixels(background_ctx, 0, 0, pixel_count_width, pixel_count_height, pixel_size, hsl_offblack);

    // Draw Panel Pattern
    // const border_width = 1;
    // const pattern_stroke = createPattern(40, 40, border_width, border_width, hsl_red, 20);

    // Draw Panel 1
    const panel1_x = roundToPixel(canvas_width * 1 / 24, pixel_size);
    const panel1_y = roundToPixel(canvas_height * 1 / 24, pixel_size); 
    const panel1_width = Math.ceil(pixel_count_width * 5 / 24);
    const panel1_height = Math.ceil(pixel_count_height * 19 / 24);
    fillCanvasWithRandomPixels(background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, pixel_size, hsl_grey, 5);
    // ctx.lineWidth = border_width;
    // ctx.strokeStyle = pattern_stroke;
    // ctx.strokeRect(panel1_x, panel1_y, panel1_width * pixel_size, panel1_height * pixel_size);

    // Draw Panel 2
    const panel2_x = roundToPixel(canvas_width * 14 / 24, pixel_size);
    const panel2_y = roundToPixel(canvas_height * 5 / 24, pixel_size); 
    const panel2_width = Math.ceil(pixel_count_width * 9 / 24);
    const panel2_height = Math.ceil(pixel_count_height * 7 / 24);
    fillCanvasWithRandomPixels(background_ctx, panel2_x, panel2_y, panel2_width, panel2_height, pixel_size, hsl_grey, 5);

    // Draw Panel 3
    const panel3_x = roundToPixel(canvas_width * 14 / 24, pixel_size);
    const panel3_y = roundToPixel(canvas_height * 13 / 24, pixel_size); 
    const panel3_width = Math.ceil(pixel_count_width * 9 / 24);
    const panel3_height = Math.ceil(pixel_count_height * 7 / 24);
    fillCanvasWithRandomPixels(background_ctx, panel3_x, panel3_y, panel3_width, panel3_height, pixel_size, hsl_grey, 5);

    // Draw Character
    const char_x = roundToPixel(canvas_width * 6.5 / 24, pixel_size);
    const char_y = roundToPixel(canvas_height * 1 / 24, pixel_size); 
    const char_width = Math.ceil(pixel_count_width * 7 / 24);
    const char_height = Math.ceil(pixel_count_height * 19 / 24);
    background_ctx.fillStyle = 'grey';
    background_ctx.fillRect(char_x, char_y, char_width * pixel_size, char_height * pixel_size);

    // Draw UI

  }

  get canvasWidth() {
    return main_ctx.canvas.width;
  }

  get canvasHeight() {
    return main_ctx.canvas.height;
  }

  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign: 'center' | 'left' | 'right' = 'center') {
    const context = main_ctx;

    // context.font = `${fontSize}px, sans-serif-black`;
    context.textAlign = textAlign;
    context.lineWidth = 2;
    // context.strokeStyle = 'blue'
    // context.strokeText(text, x, y);
    context.fillStyle = color;
    context.letterSpacing = "4px";
    context.font = `${fontSize}px monospace`;
    context.fillText(text, x, y);
  }

  drawSVG(path_string: string) {
    var path = new Path2D("M24 0h174v36h18v108h-18v30H93v24H24v-54H0V36h24V0Z");
    main_ctx.fillStyle = 'red';
    main_ctx.fill(path);
  }
}

export const drawEngine = new DrawEngine();
