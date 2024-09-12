import { container_width, globals, resource_list, pixel_size, rgb_gold, footer_y, footer_x, footer_space, hsl_grey, main_canvas, container, hsl_blue, dpr, roottwo, qrtrpi, rgb_lightgrey, hsl_darkgreen, icon_eye_placeholder_char } from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom, fillRuleWithRandom } from "./utils";
import { GameEntity, EntityTransactionDetail } from "@/core/game-entity";

const diamond_base_size = 20;

export class UIText {
  text: string;
  resource_els: Element[] = [];
  minion_text: string = ''; 
  active_entity?: GameEntity ;
  text_box: HTMLElement;
  ui_canvas: HTMLCanvasElement;
  ui_ctx: CanvasRenderingContext2D;
  diamond_canvas: HTMLCanvasElement;
  blue_diamond: HTMLCanvasElement;
  diamond_progress_canvas: HTMLCanvasElement;
  diamond_progress_ctx: CanvasRenderingContext2D;

  constructor() {
    // Add footer elements
    this.text = ''; 
    this.text_box = document.getElementById("text")!;
    document.body.style.fontSize = container_width / 64 + 'px';

    // All UI Canvas Drawing
    const [ ui_canvas, ui_ctx ]= dupeCanvas(main_canvas);
    ui_canvas.id = 'ui';
    container.insertBefore(ui_canvas, main_canvas);
    ui_ctx.scale(dpr, dpr);
    this.ui_canvas = ui_canvas;
    this.ui_ctx = ui_ctx;
    
    // Make diamond elements
    const [diamond_canvas, diamond_ctx] = dupeCanvas(main_canvas);
    this.diamond_canvas = diamond_canvas;
    diamond_canvas.width = diamond_base_size;
    diamond_canvas.height = diamond_base_size;
    
    // Blue Diamond: Fill with blue hehe
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_blue, 10, undefined, undefined, 1);
    const [blue_diamond] = dupeCanvas(this.diamond_canvas);
    this.blue_diamond = blue_diamond;

    // Grey Diamond: Fill with grey
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_grey, 10, undefined, undefined, 1);
    // fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_darkgreen, 10, 1, 1, 1);

    const [progress_canvas, progress_ctx] = dupeCanvas(this.diamond_canvas);
    this.diamond_progress_canvas = progress_canvas;
    this.diamond_progress_canvas.width = 50;
    this.diamond_progress_canvas.height = 50;
    this.diamond_progress_ctx = progress_ctx;

    this.updateEntityText();
  }

  /**
   * 
   */
  updateMinionText() {
    // TODO: Smaller clearect
    const minion_text_x = 30 * pixel_size;
    const minion_text_y = 7 * pixel_size;
    const minion_text_w = 240 * pixel_size;
    const minion_text_h = 17 * pixel_size;
    this.ui_ctx.clearRect(minion_text_x, minion_text_y, minion_text_w, minion_text_h);
    sprite_text.fillText(this.ui_ctx, this.minion_text, 34, 13, 2.7, 0.3, undefined, rgb_gold, 80);
  }

  updateEntityText() {
    const info_panel_x = 178 * pixel_size;
    const info_text_y = 33 * pixel_size;
    const info_text_w = 114 * pixel_size;
    const info_text_h = 27 * pixel_size;
    let x = 0;

    if(globals.active_entity) {
      const active_entity = globals.active_entity;
      let entity_name = active_entity.name + "";
      const is_evil_eye = entity_name.match("evil eye"); 
      // const entity_description = active_entity.description ? active_entity.description + ' ' : ''; 
      const entity_purchase_count = active_entity.purchase_count;
      const entity_purchase_limit = active_entity.purchase_limit;
      const entity_cost = active_entity.cost;
      const entity_gain = active_entity.gain;
      if(entity_purchase_limit) entity_name += ': ';

      // Clear text
      this.ui_ctx.clearRect(info_panel_x, info_text_y, info_text_w, info_text_h);

      // Name
      x += sprite_text.fillText(this.ui_ctx, entity_name, info_panel_x / pixel_size + 3, info_text_y / pixel_size + 3, 2.7, 0.3, undefined, rgb_lightgrey);
      x += 10;

      // Purchase Limit Text: (0 / 3)
      if(entity_purchase_limit) {
        const limit_string = entity_purchase_count + '/' + entity_purchase_limit;
        sprite_text.fillText(this.ui_ctx, limit_string, (x + info_panel_x) / pixel_size + 3, info_text_y / pixel_size + 3, 2.7, 0.3, undefined, rgb_gold, 80);
      }

      // Horizontal Rule
      fillRuleWithRandom(this.ui_ctx, info_panel_x + 2 * pixel_size, info_text_y + 10 * pixel_size, info_text_w - 4 * pixel_size, hsl_darkgreen);

      x = 0;
      const detail_y = info_text_y / pixel_size + 14;

      // Render Cost
      if(entity_cost) {
        let cost_strings: string[] = [];
        Object.entries(entity_cost).map(([resource_name, gain_detail]: [string, EntityTransactionDetail]) => {
          const resource_details = resource_list[resource_name as unknown as number];
          const resource_icon_char = resource_details?.placeholder_char; 
          const cost_quantity = gain_detail.quantity;
          const cost_ps = gain_detail.per_second;

          if(cost_quantity) cost_strings.push(`+${cost_quantity} ${resource_icon_char}`);
          if(cost_ps) cost_strings.push(`+${cost_ps}/s ${resource_icon_char}`);
        }).join(',');

        // Offset if entity cost
        const detail_x = (info_panel_x) / pixel_size + 3;
        sprite_text.fillText(this.ui_ctx, "COST: ", detail_x, detail_y, 2.7, 0.3, undefined, rgb_gold);
        let c_string_x = 0;
        cost_strings.map((c_string, i) => {
          c_string_x += sprite_text.fillText(this.ui_ctx, c_string, detail_x + c_string_x, detail_y + 6, 2.7, 0.3, undefined, rgb_gold) / pixel_size;
        });
      }

      // Render Gain
      if(entity_gain) {
        let gain_string = '';
        Object.entries(entity_gain).map(([resource_name, gain_detail]: [string, EntityTransactionDetail]) => {
          const resource_details = resource_list[resource_name as unknown as number];
          const resource_icon_char = resource_details?.placeholder_char; 
          const gain_quantity = gain_detail.quantity;
          const gain_ps = gain_detail.per_second;

          if(gain_quantity) gain_string += `+${gain_quantity} ${resource_icon_char}`;
          if(gain_ps) gain_string += `+${gain_ps}/s ${resource_icon_char}`;
        }).join(',');

        if(is_evil_eye) gain_string = "+1 " + icon_eye_placeholder_char + ' EVIL EYE';

        // Offset if entity cost
        const detail_x = (info_panel_x + (entity_cost ? info_text_w / 2 : 0)) / pixel_size + 3;
        sprite_text.fillText(this.ui_ctx, "GAIN: ", detail_x, detail_y, 2.7, 0.3, undefined, rgb_gold);
        sprite_text.fillText(this.ui_ctx, gain_string, detail_x, detail_y + 6, 2.7, 0.3, undefined, rgb_gold);
      }
    }
  }

  // 
  onUpdate() {
    if(globals.minion_text != this.minion_text) {
      this.minion_text = globals.minion_text;
      this.updateMinionText();
    }
    
    if(globals.active_entity != this.active_entity) {
      this.active_entity = globals.active_entity;
      this.updateEntityText();
    }
  }

  // 
  render(ctx: CanvasRenderingContext2D) {
    // Draw Resources
    resource_list.map((resource, i) => {
      const diamond_width = 22 * pixel_size;
      const footer_center = footer_y * pixel_size;
      const diamond_y = footer_center - (diamond_width / 2);
      const percent_full = resource.quantity / resource.limit;
      const diamond_y_full = (diamond_width * (1 - percent_full));
      let x = (footer_x - 7 + i * footer_space) * pixel_size;

      // Draw icon diamond
      // 
      // Compose progress icon
      const progress_width = this.diamond_progress_canvas.width;
      const progress_side_length = progress_width / roottwo;
      const shorter_side_length = progress_side_length * 0.8;

      // Fill up based on progress
      this.diamond_progress_ctx.drawImage(this.blue_diamond, 0, diamond_base_size * (1 - percent_full), diamond_base_size, diamond_base_size * percent_full, 0, diamond_y_full, progress_width, (progress_width * percent_full));
      
      // Mask out a diamond
      this.diamond_progress_ctx.save();
      this.diamond_progress_ctx.globalCompositeOperation = "destination-in";
      this.diamond_progress_ctx.translate(progress_width / 2, progress_width / 2);
      this.diamond_progress_ctx.rotate(qrtrpi);
      this.diamond_progress_ctx.fillRect(-shorter_side_length / 2, -shorter_side_length / 2, shorter_side_length, shorter_side_length);
      
      // Draw grey background behind
      this.diamond_progress_ctx.globalCompositeOperation = "destination-over";
      this.diamond_progress_ctx.fillStyle = 'red';
      this.diamond_progress_ctx.drawImage(this.diamond_canvas, -progress_side_length / 2, -progress_side_length / 2, progress_side_length, progress_side_length);
      this.diamond_progress_ctx.restore();
      this.ui_ctx.drawImage(this.diamond_progress_canvas, x, diamond_y, diamond_width, diamond_width);

      // Draw text
      const resource_quantity = Math.floor(resource.quantity);
      const resource_limit = '/' + resource.limit;
      const resource_ps = '+' + Math.floor(resource.increase_per_second * 10) / 10;

      x /= pixel_size;
      x += i === 0 ? 28 : 31;
      const text_size = 2.5; 
      const y = (footer_center / pixel_size) - text_size;
      // Offset by width
      x += sprite_text.fillText(ctx, resource_quantity + '', x, y, 4, 0.15, undefined, resource_quantity > 0 ? rgb_gold : rgb_lightgrey) / pixel_size;
      x += 1;
      x += sprite_text.fillText(ctx, resource_limit, x, y, 4, 0.15, undefined, rgb_lightgrey) / pixel_size;
      if(resource.name !== 'knowledge') {
        x += sprite_text.fillText(ctx, resource_ps, x + 3, y + 2.2, 2.5, 0.1, undefined, rgb_lightgrey) / pixel_size; 
        sprite_text.fillText(ctx, '/s', x + 3.3, y + 3.2, 1.7, 0.5, undefined, rgb_lightgrey); 
      }
    });
  }
}