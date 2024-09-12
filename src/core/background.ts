import {
  container_width,
  container_height,
  pixel_size,
  hsl_grey,
  hsl_darkred,
  main_canvas,
  dpr,
  container,
  window_width,
  window_height,
  base_canvas,
  grid_row,
  grid_col,
  panel_top_row,
  violin_num_octaves,
  rgb_lightgrey,
  hsl_darkgreen,
  hsl_offblack,
  char_x,
  char_y,
  char_border_inset,
  char_h,
  char_w,
  hsl_lightgrey,
  minion_x,
  minion_y,
  minion_width,
  minion_height,
} from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom, ranHSL } from "./utils";

/**
 * 
 */
export function renderBackground() {
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
  fillRectWithRandom(stage_background_ctx, 0, 0, container_width, container_height, hsl_darkgreen, 8);

  // 
  // ORGANS PANEL
  // 
  const panel1_x = grid_col(1);
  const panel1_y = panel_top_row;
  const panel1_width = grid_col(5.5);
  const panel1_height = grid_row(16);
  fillRectWithRandom(stage_background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, hsl_grey, 6);
  fillRectWithRandom(stage_background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, hsl_grey, 20, 2);
  // fillRectWithRandom(stage_background_ctx, panel1_x, panel1_y, panel1_width, panel1_height, hsl_darkgreen, 20, 12, 11);

  // 
  // MINION PANEL
  // 
  fillRectWithRandom(stage_background_ctx, minion_x, minion_y, minion_width, minion_height, hsl_grey, 5);
  // fillRectWithRandom(stage_background_ctx, minion_x, minion_y, minion_width, minion_height, hsl_darkred, 5, 0.5);

  // 
  // BAND PANEL
  // 
  const panel2_x = grid_col(14);
  const panel2_y = panel_top_row + grid_row(3.5); 
  const panel2_width = grid_col(9);
  const panel2_height = grid_row(6);
 
  fillRectWithRandom(stage_background_ctx, panel2_x, panel2_y, panel2_width, panel2_height, hsl_grey, 8);
  fillRectWithRandom(stage_background_ctx, panel2_x, panel2_y, panel2_width, panel2_height, hsl_darkgreen, 25, 1, 1);
  sprite_text.fillText(stage_background_ctx, "The Band", panel2_x * 1.22 / pixel_size, (panel2_y + panel2_height) * .88 / pixel_size, 5, 0.83, undefined, rgb_lightgrey);
  
  const violin_octaves_height = 30 * pixel_size;

  for (let i = 1; i < violin_num_octaves + 1; i++) {
    stage_background_ctx.fillStyle = ranHSL(hsl_offblack);
    stage_background_ctx.fillRect(panel2_x + 38 * pixel_size, panel2_y + (10 + i * violin_octaves_height / violin_num_octaves), 67 * pixel_size, pixel_size);
  }


  // 
  // LIBRARY PANEL
  // 
  const panel3_x = grid_col(14);
  const panel3_y = panel_top_row + grid_row(10.25);
  const panel3_width = grid_col(9);
  const panel3_height = grid_row(5.75);
  fillRectWithRandom(stage_background_ctx, panel3_x, panel3_y, panel3_width, panel3_height, hsl_grey, 8);
  fillRectWithRandom(stage_background_ctx, panel3_x, panel3_y, panel3_width, panel3_height, hsl_darkgreen, 25, 1, 1);
  sprite_text.fillText(stage_background_ctx, "The Library", panel3_x * 1.05 / pixel_size, (panel3_y + panel3_height) * .91 / pixel_size, 5, 0.81, undefined, rgb_lightgrey);

  // 
  // CHARACTER PANEL
  // 

  // Red background
  fillRectWithRandom(stage_background_ctx, char_x, char_y, char_w, char_h, hsl_darkred);
  fillRectWithRandom(stage_background_ctx, char_x + char_border_inset, char_y + char_h - char_border_inset * 6, char_w - char_border_inset * 2, char_border_inset * 5.1, hsl_lightgrey, 20);
  fillRectWithRandom(stage_background_ctx, char_x, char_y, char_w, char_h, hsl_grey, 5, 2);
  fillRectWithRandom(stage_background_ctx, char_x, char_y, char_w, char_h, hsl_darkgreen, 25, 1, 1);

  // 
  // INFO PANEL
  // 
  const info_x = grid_col(7);
  const info_y = grid_row(16.3);
  const info_w = grid_col(6.5);
  const info_h = grid_row(2.2);
  fillRectWithRandom(stage_background_ctx, info_x, info_y, info_w, info_h, hsl_grey, 6);


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