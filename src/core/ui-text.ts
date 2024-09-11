import { container_width, container, createIconSvg, globals, resource_map, resource_list, Resources, pixel_size, rgb_gold, footer_y, footer_x, footer_space, base_canvas, halfpi, main_ctx, hsl_blue, hsl_grey } from "./constants";
import { sprite_text } from "./sprite-text";
import { dupeCanvas, fillRectWithRandom, htmlFromString, ranHSL } from "./utils";
import { EntityGainDetail } from "@/core/game-entity";

const diamond_base_size = 24;

export class UIText {
  text: string;
  resource_els: Element[] = [];
  minion_text: string = ''; 
  text_box: HTMLElement;
  diamond_canvas: HTMLCanvasElement;
  blue_diamond: HTMLCanvasElement;

  constructor() {
    // Add footer elements
    this.text = ''; 
    this.text_box = document.getElementById("text")!;
    document.body.style.fontSize = container_width / 64 + 'px';
    
    const footer = htmlFromString("<div id='footer'></div>");
    resource_list.map(resource => {
      const el = this.addFooterElement(resource);
      footer.append(el);
      this.resource_els.push(el);
    });
    container.append(footer);

    // Make diamond elements
    const [diamond_canvas, diamond_ctx] = dupeCanvas(base_canvas);
    this.diamond_canvas = diamond_canvas;
    diamond_canvas.width = diamond_base_size;
    diamond_canvas.height = diamond_base_size;

    // Grey Diamond: Fill with grey
    document.body.append(diamond_canvas);
    fillRectWithRandom(diamond_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_grey, 10, undefined, 1);
    // Mask out Diamond
    diamond_ctx.globalCompositeOperation = 'destination-in';
    diamond_ctx.translate(diamond_base_size / 2, 1);
    diamond_ctx.rotate(halfpi / 2);
    diamond_ctx.fillRect(0, 0, Math.ceil(diamond_base_size * .6), Math.ceil(diamond_base_size * .6));

    // Blue Diamond: Fill with blue
    const [blue_diamond, blue_ctx] = dupeCanvas(this.diamond_canvas);
    this.blue_diamond = blue_diamond;

    blue_ctx.globalCompositeOperation = 'source-over';
    fillRectWithRandom(blue_ctx, 0, 0, diamond_base_size, diamond_base_size, hsl_blue, 10, undefined, 1);
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

  // 
  addFooterElement(resource: ResourceDetails): Element {
    const icon_el = createIconSvg(resource_map[resource.type as Resources].icon);
    const resource_el = htmlFromString(`<div class='${resource.name}'><div class='icon'></div><p class='quantity'></p><p class='per_second'></p></div>`);
    resource_el.querySelector('.icon')!.append(icon_el);
    return resource_el;
  }

  /**
   * 
   */
  updateMinionText(text:string) {

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
      const diamond_y = (footer_y - 7) * pixel_size;
      const percent_full = resource.quantity / resource.limit;
      const resource_quantity = Math.floor(resource.quantity) + '/' + resource.limit;
      const resource_ps = '+' + Math.floor(resource.increase_per_second * 10) / 10;

      // Draw icon diamond
      main_ctx.drawImage(this.diamond_canvas, x, diamond_y, diamond_width, diamond_width);
      main_ctx.drawImage(this.blue_diamond, 0, diamond_base_size * (1 - percent_full), diamond_base_size, diamond_base_size * percent_full, x, diamond_y + (diamond_width * (1 - percent_full)), diamond_width, (diamond_width * percent_full));

      x /= pixel_size;
      x += 28;
      const y = footer_y * 1.01;
      // Offset by width
      x += sprite_text.fillText(ctx, resource_quantity, x, y, 4, 0.15, rgb_gold) / pixel_size;
      x += sprite_text.fillText(ctx, resource_ps, x + 3, y + 2.2, 2.5, 0.1, rgb_gold) / pixel_size; 
      sprite_text.fillText(ctx, '/s', x + 3.3, y + 3.2, 1.7, 0.5, rgb_gold); 
    });
  }
}