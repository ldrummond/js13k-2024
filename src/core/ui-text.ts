import { Animator } from "./animator";
import { container_width, globals, resource_list, pixel_size, rgb_gold, footer_y, footer_x, footer_space, hsl_grey, main_canvas, container, dpr, roottwo, rgb_lightgrey, icon_eye_placeholder_char, rgb_red, qrtrpi, hsl_gold, rgb_offwhite } from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom } from "./utils";
import { GameEntity, EntityTransactionDetail } from "@/core/game-entity";

const progress_canvas_width = 20;
const diamond_base_size = 20;
const minion_text_type_delay = 50;
const afford_color = rgb_gold;
const cant_afford_color = rgb_red; 
const detail_font_size = 3;
const detail_font_spacing = .2;

export class UIText {
  text: string;
  resource_els: Element[] = [];
  minion_text_typing: boolean = false; 
  minion_text_queue: string[] = [];
  active_entity?: GameEntity ;
  text_box: HTMLElement;
  ui_canvas: HTMLCanvasElement;
  ui_ctx: CanvasRenderingContext2D;
  diamond_canvas: HTMLCanvasElement;
  blue_diamond: HTMLCanvasElement;
  diamond_progress_canvas: HTMLCanvasElement;
  diamond_progress_ctx: CanvasRenderingContext2D;
  tooltip_canvas: HTMLCanvasElement;
  tooltip_ctx: CanvasRenderingContext2D;

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
    ui_ctx.imageSmoothingEnabled = false;
    this.ui_canvas = ui_canvas;
    this.ui_ctx = ui_ctx;

    // Tooltip canvas
    const [ tooltip_canvas, tooltip_ctx ] = dupeCanvas(main_canvas);
    container.append(tooltip_canvas);
    tooltip_ctx.scale(dpr, dpr);
    tooltip_ctx.imageSmoothingEnabled = false; 
    this.tooltip_canvas = tooltip_canvas;
    this.tooltip_ctx = tooltip_ctx;
    
    // Make diamond elements
    const [diamond_canvas, diamond_ctx] = dupeCanvas(main_canvas);
    this.diamond_canvas = diamond_canvas;
    diamond_canvas.width = diamond_base_size;
    diamond_canvas.height = diamond_base_size;
    
    // Blue Diamond: Fill with blue hehe
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_gold, 10, undefined, undefined, 1);
    const [blue_diamond] = dupeCanvas(this.diamond_canvas);
    this.blue_diamond = blue_diamond;

    // Grey Diamond: Fill with grey
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_grey, 10, undefined, undefined, 1);

    const [progress_canvas, progress_ctx] = dupeCanvas(this.diamond_canvas);
    this.diamond_progress_canvas = progress_canvas;
    this.diamond_progress_canvas.width = progress_canvas_width;
    this.diamond_progress_canvas.height = progress_canvas_width;
    this.diamond_progress_ctx = progress_ctx;

    this.updateEntityText();
  }

  /**
   * 
   */
  updateMinionText(text: string) {
    // Queue text
    console.log('minion', text, this.minion_text_typing);
    
    if(this.minion_text_typing) {
      this.minion_text_queue.push(text);
      return;
    }

    // Play 
    console.log('typing start');
    this.minion_text_typing = true;
    setTimeout(() => {
      console.log('typing end');
      
      this.minion_text_typing = false; 
    }, text.length * minion_text_type_delay + 800);

    // TODO: Smaller clearect
    const minion_text_x = 30 * pixel_size;
    const minion_text_y = 7 * pixel_size;
    const minion_text_w = 400 * pixel_size;
    const minion_text_h = 17 * pixel_size;
    this.ui_ctx.clearRect(minion_text_x, minion_text_y, minion_text_w, minion_text_h);
    sprite_text.fillText(this.ui_ctx, text, 34, 13, 2.7, 0.3, undefined, rgb_gold, minion_text_type_delay);
  }

  /**
   * 
   */
  updateEntityText() {
    const info_panel_x = 178 * pixel_size;
    const info_text_y = 33 * pixel_size;
    const info_text_w = 114 * pixel_size;
    const info_text_h = 27 * pixel_size;

    const active_entity = globals.active_entity;

    // Clear text
    this.ui_ctx.clearRect(info_panel_x, info_text_y, info_text_w, info_text_h);

    // Fill with content
    if(active_entity) {
      let entity_name = active_entity.name + "";
      const is_evil_eye = entity_name.match("evil eye"); 
      // const entity_description = active_entity.description ? active_entity.description + ' ' : ''; 
      const entity_purchase_count = active_entity.purchase_count;
      const entity_purchase_limit = active_entity.purchase_limit;
      const entity_cost = active_entity.cost;
      const entity_gain = active_entity.gain;
      if(entity_purchase_limit) entity_name += ': ';
   
      // Name
      sprite_text.fillText(this.ui_ctx, entity_name, info_panel_x / pixel_size + 3, info_text_y / pixel_size + 3, 2.7, 0.3, undefined, rgb_offwhite);

      // Purchase Limit Text: (0 / 3)
      if(entity_purchase_limit) {
        const limit_string = entity_purchase_count + '/' + entity_purchase_limit;
        const limit_color = entity_purchase_count === entity_purchase_limit ? rgb_red : rgb_gold;
        sprite_text.fillText(this.ui_ctx, limit_string, (info_panel_x + info_text_w) / pixel_size - 20, info_text_y / pixel_size + 3, 2.7, 0.3, undefined, limit_color);
      }

      const detail_y = info_text_y / pixel_size + 13;
      let detail_x = (info_panel_x) / pixel_size + 3;
      
      if(entity_cost || entity_gain) {
        // Render Cost
        sprite_text.fillText(this.ui_ctx, "COST: ", detail_x, detail_y, detail_font_size, detail_font_spacing, undefined, rgb_offwhite);
        let c_string_x = 0;
        
        // Render individual resource costs
        Object.entries(entity_cost || []).map(([resource_name, transaction_detail]: [string, EntityTransactionDetail]) => {
          const resource_details = resource_list[resource_name as unknown as number];
          const resource_icon_char = resource_details?.placeholder_char; 
          const cost_quantity = transaction_detail.quantity && Math.round(transaction_detail.quantity);
          const cost_ps = transaction_detail.per_second;
  
          let string_color = afford_color;
          if(cost_quantity) {
            const can_afford_quantity = resource_details.quantity >= cost_quantity;
            const cost_quantity_string = (`${cost_quantity}${resource_icon_char} `);
            string_color = can_afford_quantity ? afford_color : cant_afford_color;
            c_string_x += sprite_text.fillText(this.ui_ctx, cost_quantity_string, detail_x + c_string_x, detail_y + 7, detail_font_size, detail_font_spacing, undefined, string_color) / pixel_size;
          }
          if(cost_ps) {
            const can_afford_ps = resource_details.increase_per_second >= cost_ps;
            // Remove leading 0 from decimal
            const cost_ps_string = (`${(cost_ps.toFixed(1) + '').replace(/0(\.\d+)/, '$1')}/s${resource_icon_char} `);
            string_color = can_afford_ps ? afford_color : cant_afford_color;
            c_string_x += sprite_text.fillText(this.ui_ctx, cost_ps_string, detail_x + c_string_x, detail_y + 7, detail_font_size, detail_font_spacing, undefined, string_color) / pixel_size;
          }
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
          const gain_max = gain_detail.limit; 

          // remove 0 from decimal
          if(gain_quantity) gain_string += `+${gain_quantity}${resource_icon_char}`;
          if(gain_ps) gain_string += `+${(gain_ps.toFixed(1) + '').replace(/0(\.\d+)/, '$1')}/s${resource_icon_char}`;
          if(gain_max) gain_string += `+${gain_max}${resource_icon_char}MAX`;
        }).join(',');

        if(is_evil_eye) gain_string = "" + icon_eye_placeholder_char + ' evil eye';

        // Offset if entity cost
        detail_x += 60;
        sprite_text.fillText(this.ui_ctx, "GAIN: ", detail_x, detail_y, detail_font_size, detail_font_spacing, undefined, rgb_offwhite);
        sprite_text.fillText(this.ui_ctx, gain_string, detail_x, detail_y + 7, detail_font_size, detail_font_spacing, undefined, rgb_gold);
      }
    }
  }

  /**
   * 
   * @param resource_details 
   * @param quantity_change 
   * @param ps_change 
   */
  renderGainTooltip(resource_details: ResourceDetails, quantity_change: number, ps_change: number, limit_change: number) {
    const resource_index = resource_list.indexOf(resource_details);
    const tooltip_x =  (footer_x + 12 + resource_index * footer_space); 
    const tooltip_y = footer_y - 14;

    let text = '';
    if(quantity_change) text += '+' + quantity_change;
    if(ps_change) text += " +" + ps_change + '/s';
    if(limit_change) text += " +" + limit_change + 'MAX';

    const rect_x = tooltip_x * pixel_size;
    const rect_y = (tooltip_y - 12) * pixel_size;
    const rect_w = 150 * pixel_size;
    const rect_h = 25 * pixel_size;

    new Animator(1000, 1, (percent_complete) => {
      const offset = -10 * percent_complete;
      this.tooltip_ctx.clearRect(rect_x, rect_y, rect_w, rect_h);
      sprite_text.fillText(this.tooltip_ctx, text, (tooltip_x + 5), tooltip_y + offset, 4.3, undefined, undefined, rgb_gold);
      // Fade out
      this.tooltip_ctx.globalCompositeOperation = 'destination-out'; 
      this.tooltip_ctx.fillStyle = `rgba(0, 0, 0, ${percent_complete})`; 
      this.tooltip_ctx.fillRect(rect_x, rect_y, rect_w, rect_h);
      this.tooltip_ctx.globalCompositeOperation = 'source-over'; 
    });
  }

  // 
  // 
  onUpdate() {
    if(this.minion_text_queue.length > 0 && !this.minion_text_typing) {
      console.log('next minion text');
      const next_text = this.minion_text_queue.shift() + '';
      this.updateMinionText(next_text); 
    }

    this.updateEntityText();
  }

  // 
  render(ctx: CanvasRenderingContext2D) {
    // Draw Resources
    resource_list.map((resource, i) => {
      const diamond_width = 22 * pixel_size;
      const footer_center = footer_y * pixel_size;
      const diamond_y = footer_center - (diamond_width / 2);
      const percent_full = resource.quantity / (resource.limit);
      let x = (footer_x - 6.2 + i * footer_space) * pixel_size;

      // Draw icon diamond
      // 
      // Compose progress icon
      const progress_width = this.diamond_progress_canvas.width;
      const progress_side_length = progress_width / roottwo;
      const shorter_side_length = progress_side_length * 0.8;

      // Fill up based on progress
      this.diamond_progress_ctx.clearRect(0, 0, progress_canvas_width, progress_canvas_width);
      const percent_source_width = diamond_base_size * percent_full;
      const percent_progress_width = progress_width * percent_full;
      this.diamond_progress_ctx.drawImage(this.blue_diamond, 0, (diamond_base_size - percent_source_width), diamond_base_size, percent_source_width, 0, (progress_width - percent_progress_width), progress_width, percent_progress_width);
      
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
      this.diamond_progress_ctx.globalCompositeOperation = "source-over";

      // Draw text
      const resource_quantity = Math.floor(resource.quantity);
      const resource_limit = '/' + resource.limit;
      const resource_ps = '+' + Math.floor(resource.increase_per_second * 10) / 10;

      x /= pixel_size;
      x += 25;
      const text_size = 2.5; 
      const y = (footer_center / pixel_size) - text_size;
      // Offset by width
      x += sprite_text.fillText(ctx, resource_quantity + '', x, y, 4, 0.15, undefined, resource_quantity > 0 ? rgb_gold : rgb_lightgrey) / pixel_size;
      x += 1;
      x += sprite_text.fillText(ctx, resource_limit, x, y, 4, 0.15, undefined, rgb_lightgrey) / pixel_size;
      
      if(resource.name !== 'knowledge') {
        const ps_color = (resource.increase_per_second > 0) ? rgb_gold : rgb_lightgrey;
        x += sprite_text.fillText(ctx, resource_ps, x + 3, y + 2.2, 2.5, 0.1, undefined, ps_color) / pixel_size; 
        sprite_text.fillText(ctx, '/s', x + 3.3, y + 3.2, 1.7, 0.5, undefined, ps_color); 
      }
    });
  }
}