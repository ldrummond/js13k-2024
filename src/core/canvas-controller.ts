import { 
  main_ctx,
  container_width,
  container_height,
  pixel_size,
  hsl_grey,
  hsl_offblack,
  hsl_darkred,
  main_canvas,
  dpr,
  container,
  hsl_lightgrey,
  window_width,
  window_height,
  base_canvas,
  grid_row,
  grid_col,
  rgb_lightgrey,
  panel_top_row,
} from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom } from "./utils";

/**
 * 
 */
export class CanvasController {
  constructor() {
    // Add page background
    const [page_background_texture_canvas, page_background_texture_ctx] = dupeCanvas(base_canvas);
    page_background_texture_canvas.id = 'page-background';
    document.body.prepend(page_background_texture_canvas);
    fillRectWithRandom(page_background_texture_ctx, 0, 0, window_width, window_height, hsl_grey, 1);

    // Add Background 
    const [stage_background_canvas, stage_background_ctx] = dupeCanvas(main_canvas);
    stage_background_canvas.id = 'background';
    // const background_ctx = stage_background_canvas.getContext("2d")!;
    stage_background_ctx.scale(dpr, dpr);
    container.prepend(stage_background_canvas);

    // Draw Background Layer
    fillRectWithRandom(stage_background_ctx, 0, 0, container_width, container_height, hsl_offblack);


    // 
    // ORGANS PANEL
    // 
    const panel1_x = grid_col(1);
    const panel1_y = panel_top_row;
    const panel1_width = grid_col(5.5);
    const panel1_height = grid_row(16);
    fillRectWithRandom(stage_background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, hsl_grey, 6);
    fillRectWithRandom(stage_background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, hsl_grey, 20, 2);

    // 
    // MINION PANEL
    // 
    const minion_x = grid_col(14);
    const minion_y = panel_top_row; 
    const minion_width = grid_col(9);
    const minion_height = grid_row(2.75);
    fillRectWithRandom(stage_background_ctx, minion_x, minion_y, minion_width, minion_height, hsl_grey, 5);
    // fillRectWithRandom(stage_background_ctx, minion_x, minion_y, minion_width, minion_height, hsl_darkred, 5, 0.5);

    // 
    // CHOIR PANEL
    // 
    const panel2_x = grid_col(14);
    const panel2_y = panel_top_row + grid_row(3.5); 
    const panel2_width = grid_col(9);
    const panel2_height = grid_row(5.75);
    const panel_border_inset = 3 * pixel_size;
    // 
    const panel2_border_x = panel2_x + panel_border_inset;
    const panel2_border_y = panel2_y + panel_border_inset; 
    const panel2_border_width = panel2_width - panel_border_inset * 2;
    const panel2_border_height = panel2_height - panel_border_inset * 2;

    fillRectWithRandom(stage_background_ctx, panel2_x, panel2_y, panel2_width, panel2_height, hsl_grey, 5);
    fillRectWithRandom(stage_background_ctx, panel2_border_x, panel2_border_y, panel2_border_width, panel2_border_height, hsl_lightgrey, 20, 2);
    sprite_text.fillText(stage_background_ctx, "CHOIR", panel2_x * 1.2 / pixel_size, (panel2_y + panel2_height) * .84 / pixel_size, 5, 0.8, rgb_lightgrey);

    // 
    // LIBRARY PANEL
    // 
    const panel3_x = grid_col(14);
    const panel3_y = panel_top_row + grid_row(10);
    const panel3_width = grid_col(9);
    const panel3_height = grid_row(5.75);
    
    const panel3_border_x = panel3_x + panel_border_inset;
    const panel3_border_y = panel3_y + panel_border_inset;
    const panel3_border_width = panel3_width - panel_border_inset * 2;
    const panel3_border_height = panel3_height - panel_border_inset * 2;

    fillRectWithRandom(stage_background_ctx, panel3_x, panel3_y, panel3_width, panel3_height, hsl_grey, 5);
    fillRectWithRandom(stage_background_ctx, panel3_border_x, panel3_border_y, panel3_border_width, panel3_border_height, hsl_lightgrey, 20, 2);
    sprite_text.fillText(stage_background_ctx, "The Library", panel3_x * 1.05 / pixel_size, (panel3_y + panel3_height) * .91 / pixel_size, 5, 0.81, rgb_lightgrey);

    // 
    // CHARACTER PANEL
    // 
    const char_x = grid_col(7);
    const char_y = panel_top_row;
    const char_width = grid_col(6.5);
    const char_height = grid_row(13);
    const char_border_inset = 2 * pixel_size;
    fillRectWithRandom(stage_background_ctx, char_x + char_border_inset, char_y + char_border_inset, char_width - char_border_inset * 2, char_height - char_border_inset * 2, hsl_darkred, 12);
    fillRectWithRandom(stage_background_ctx, char_x + char_border_inset, char_y + char_height - char_border_inset * 6, char_width - char_border_inset * 2, char_border_inset * 5.1, hsl_lightgrey, 20);
    fillRectWithRandom(stage_background_ctx, char_x, char_y, char_width, char_height, hsl_grey, 5, 5);

    // Draw stalagtites
    // const temp_canvas = dupeCanvas(base_canvas);
    // const temp_ctx = temp_canvas.getContext("2d")!;
    // temp_canvas.width = 100;
    // temp_canvas.height = 20;
    // document.body.append(temp_canvas);
    // temp_canvas.style.position = 'absolute';
    // fillRectWithRandom(temp_ctx, 0, 0, 100, 20, hsl_darkred, 15);
    // let x = 0;
    // const y = temp_canvas.height;
    // temp_ctx.moveTo(x, y);
    // temp_ctx.beginPath(); 
    // temp_ctx.lineTo(temp_canvas.width, 0);
    // while(x < temp_canvas.width) {
    //   if(Math.random() > 0.9) {
    //     const rad_h = Math.random() * temp_canvas.height / 2;
    //     const rad_w = rad_h * 0.3;
    //     temp_ctx.lineTo(x, y);
    //     temp_ctx.lineTo(x + (rad_w / 2), y - (rad_h / 2));
    //     temp_ctx.lineTo(x + rad_w, y);
    //     x += rad_w * 2;
    //   }
    //   x++;
    // }
    // temp_ctx.strokeStyle = 'black';
    // temp_ctx.lineWidth = 10;
    // temp_ctx.fillStyle = 'black';
    // temp_ctx.stroke();
    // temp_ctx.fill();

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
    context.font = `${fontSize}px monospace`;
    context.fillText(text, x, y);
  }
}