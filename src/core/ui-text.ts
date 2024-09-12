import { container_width, globals, resource_list, pixel_size, rgb_gold, footer_y, footer_x, footer_space, halfpi, main_ctx, hsl_grey, hsl_red, main_canvas, container, panel_top_row } from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom, ranHSL } from "./utils";
import { EntityGainDetail } from "@/core/game-entity";

const diamond_base_size = 24;

export class UIText {
  text: string;
  resource_els: Element[] = [];
  minion_text: string = ''; 
  text_box: HTMLElement;
  diamond_canvas: HTMLCanvasElement;
  blue_diamond: HTMLCanvasElement;
  minion_ctx: CanvasRenderingContext2D;

  constructor() {
    // Add footer elements
    this.text = ''; 
    this.text_box = document.getElementById("text")!;
    document.body.style.fontSize = container_width / 64 + 'px';

    // Minion text
    const [ minion_canvas, minion_ctx ]= dupeCanvas(main_canvas);
    container.append(minion_canvas);
    this.minion_ctx = minion_ctx;
    
    // Make diamond elements
    const [diamond_canvas, diamond_ctx] = dupeCanvas(main_canvas);
    this.diamond_canvas = diamond_canvas;
    diamond_canvas.width = diamond_base_size;
    diamond_canvas.height = diamond_base_size;

    // Grey Diamond: Fill with grey
    document.body.append(diamond_canvas);
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_grey, 10, undefined, undefined, 1);
    // Mask out Diamond
    diamond_ctx.globalCompositeOperation = 'destination-in';
    diamond_ctx.translate(diamond_base_size / 2, 1);
    diamond_ctx.rotate(halfpi / 2);
    diamond_ctx.fillRect(0, 0, Math.ceil(diamond_base_size * .6), Math.ceil(diamond_base_size * .6));

    // Blue Diamond: Fill with blue hehe
    const [blue_diamond, blue_ctx] = dupeCanvas(this.diamond_canvas);
    this.blue_diamond = blue_diamond;

    blue_ctx.globalCompositeOperation = 'source-over';
    fillRectWithRandom(blue_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_red, 10, undefined, undefined, 1);
    blue_ctx.translate(diamond_base_size / 2, 1);
    blue_ctx.rotate(halfpi / 2);
    // Border
    blue_ctx.strokeStyle = ranHSL(hsl_grey);
    blue_ctx.lineWidth = 3;
    blue_ctx.strokeRect(0, 0, Math.ceil(diamond_base_size * .6), Math.ceil(diamond_base_size * .6));
    // Mask out Diamond
    blue_ctx.globalCompositeOperation = 'destination-in';
    blue_ctx.fillRect(0, 0, Math.ceil(diamond_base_size * .6), Math.ceil(diamond_base_size * .6));
  }

  /**
   * 
   */
  updateMinionText(text:string) {
    
    this.minion_ctx.clearRect(0, 0, main_canvas.width, main_canvas.height);
    sprite_text.fillText(this.minion_ctx, text, 360, panel_top_row / pixel_size + 27, 5.5, 0.25, 130 * pixel_size, rgb_gold, 80);
  }

  // 
  onUpdate() {
    if(globals.minion_text != this.minion_text) {
      this.updateMinionText(globals.minion_text);
      this.minion_text = globals.minion_text;
    }
    // resource_list.map((resource, i) => {
    //   const resource_el = container.querySelector('.' + resource.name)!;
    //   const quantity_el = resource_el.querySelector(".quantity")!;
    //   const per_second_el = resource_el.querySelector(".per_second")!;
    //   // quantity_el.textContent = Math.floor(resource.quantity) + '/' + resource.limit;
    //   per_second_el.textContent = '+' + Math.floor(resource.increase_per_second * 10) / 10 + 's';
    // })

    // Update message
    const active_entity = globals.active_entity;
    this.text_box.innerHTML = '';
    if(active_entity) {
      let gain; 
      if(active_entity.gain) {
        gain = Object.entries(active_entity.gain).map(([resource_name, gain_detail]: [string, EntityGainDetail]) => {
          return (gain_detail.quantity ? `<em>+${gain_detail.quantity} <i class=${resource_name}></i>${resource_name}</em>` : '') +
            (gain_detail.per_second ? `<em>+${gain_detail.per_second} <i class=${resource_name}></i>${resource_name}/s</em>` : '');
        }).join(',');
      }

      this.text_box.innerHTML = `
        <p>${active_entity.name} <em>${gain}</em></p>
        <p>${active_entity.description}
        <p>${active_entity.gain}
      `;
    }
    // this.text_box.textContent = globals.active_message;
  }

  // 
  render(ctx: CanvasRenderingContext2D) {
    // Draw Resources
    resource_list.map((resource, i) => {
      const diamond_width = 25 * pixel_size;
      let x = (footer_x - 7 + i * footer_space) * pixel_size;
      if(i !== 0) x += 10;
      const diamond_y = (footer_y - 7) * pixel_size;
      const percent_full = resource.quantity / resource.limit;
      const resource_quantity = Math.floor(resource.quantity) + '/' + resource.limit;
      const resource_ps = '+' + Math.floor(resource.increase_per_second * 10) / 10;

      // Draw icon diamond
      main_ctx.drawImage(this.diamond_canvas, x, diamond_y, diamond_width, diamond_width);
      main_ctx.drawImage(this.blue_diamond, 0, diamond_base_size * (1 - percent_full), diamond_base_size, diamond_base_size * percent_full, x, diamond_y + (diamond_width * (1 - percent_full)), diamond_width, (diamond_width * percent_full));

      x /= pixel_size;
      x += i === 0 ? 28 : 31;
      const y = footer_y * 1.01;
      // Offset by width
      x += sprite_text.fillText(ctx, resource_quantity, x, y, 4, 0.15, undefined, rgb_gold) / pixel_size;
      if(resource.name !== 'knowledge') {
        x += sprite_text.fillText(ctx, resource_ps, x + 3, y + 2.2, 2.5, 0.1, undefined, rgb_gold) / pixel_size; 
        sprite_text.fillText(ctx, '/s', x + 3.3, y + 3.2, 1.7, 0.5, undefined, rgb_gold); 
      }
    });
  }
}