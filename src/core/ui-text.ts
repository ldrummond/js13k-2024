import { canvas_width, container, createIconSvg, globals, resource_map, resource_list, Resources } from "./constants";
import { EntityGainDetail } from "./game-entity";
import { htmlFromString } from "./utils";


export class UIText {
  text: string;
  resource_els: Element[] = [];
  text_box: HTMLElement;

  constructor() {
    // Add footer elements
    this.text = ''; 
    this.text_box = document.getElementById("text")!;
    document.body.style.fontSize = canvas_width / 64 + 'px';
    
    const footer = htmlFromString("<div id='footer'></div>")
    resource_list.map(resource => {
      const el = this.addFooterElement(resource);
      footer.append(el);
      this.resource_els.push(el);
    });
    container.append(footer);
  }

  addFooterElement(resource: ResourceDetails): Element {
    const icon_el = createIconSvg(resource_map[resource.type as Resources].icon);
    const resource_el = htmlFromString(`<div class='${resource.name}'><p class='quantity'></p><p class='per_second'></p></div>`);
    resource_el.prepend(icon_el);
    return resource_el;
  }

  onUpdate() {
    // Update resources count
    resource_list.map(resource => {
      const resource_el = container.querySelector('.' + resource.name)!;
      const quantity_el = resource_el.querySelector(".quantity")!;
      const per_second_el = resource_el.querySelector(".per_second")!;
      quantity_el.textContent = Math.floor(resource.quantity) + '/' + resource.limit;
      per_second_el.textContent = '+' + Math.floor(resource.increase_per_second * 10) / 10 + 's';
    })
    

    // Update message
    const active_entity = globals.active_entity;
    this.text_box.innerHTML = '';
    if(active_entity) {
      const gain = Object.entries(active_entity.gain).map(([resource_name, gain_detail]: [string, EntityGainDetail]) => {
        return (gain_detail.quantity ? `<em>+${gain_detail.quantity} <i class=${resource_name}></i>${resource_name}</em>` : '') +
          (gain_detail.per_second ? `<em>+${gain_detail.per_second} <i class=${resource_name}></i>${resource_name}/s</em>` : '');
      }).join(',')
      
      this.text_box.innerHTML = `
        <p>${active_entity.name} <em>${gain}</em></p>
        <p>${active_entity.description}
        <p>${active_entity.gain}
      `
    }
    // this.text_box.textContent = globals.active_message;

    
  }
}