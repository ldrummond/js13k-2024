import { container, dpr, hsl_red, main_canvas, pixel_size, rgb_offblack } from "./constants";
import { drawSpritesheetImage, dupeCanvas, fillRectWithRandom } from "./utils";
import { sprite_text } from "./sprite-text";
import { spritesheet_data } from "@/data/spritesheet-data";
import { Animator } from "./animator";


export function drawEndFrame() {
  const [end_canvas, end_ctx] = dupeCanvas(main_canvas);
  container.append(end_canvas);
  end_canvas.id = 'end';
  end_ctx.scale(dpr, dpr);
  end_ctx.imageSmoothingEnabled = false;

  const end_steps = 10;
  const end_step_unit = end_canvas.height / dpr / end_steps;
  const eye_w = 51 * pixel_size;
  const final_text = 'Fear! A new demon has emerged from puberty and risen to torment the earth!';

  new Animator(800, end_steps, undefined, (repeats_left: number) => {
    const step = end_steps - repeats_left;
    
    if(step > 0 && repeats_left > 1) {
      fillRectWithRandom(end_ctx, 0, end_step_unit * (step - 1), end_canvas.width, end_step_unit * step, hsl_red, 10);
    }
    
    // On complete
    if(repeats_left == 1) {
      drawSpritesheetImage(end_ctx, spritesheet_data['eye'], 100 * pixel_size, 20 * pixel_size, eye_w * 2, eye_w * 1.5);
      sprite_text.fillText(end_ctx, final_text, 20, 115, 7, undefined, 200, rgb_offblack, 70);
      setTimeout(() => {
        sprite_text.fillText(end_ctx, "YOU WIN: AND WE LOSE", 100, 200, 6, undefined, 200, rgb_offblack);
    }, final_text.length * 70);
    }
  });
}