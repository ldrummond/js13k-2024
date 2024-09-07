import { confidence, hormones, knowledge, maturity } from "./core/constants";
import { game_data } from "./core/game-logic";
import { State } from "./core/state";

export default class DebugPanel implements State {
  has_initialized: boolean;
  panel: HTMLElement | null;
  hormones_panel: HTMLElement | null;
  confidence_panel: HTMLElement | null;
  maturity_panel: HTMLElement | null;
  knowledge_panel: HTMLElement | null;

  constructor() {
    this.has_initialized = false;
    this.panel = document.getElementById("debug")!;
    this.hormones_panel = this.panel?.querySelector(".hormones");
    this.confidence_panel = this.panel?.querySelector(".confidence");
    this.maturity_panel =  this.panel?.querySelector(".maturity");
    this.knowledge_panel =  this.panel?.querySelector(".knowledge");

    document.addEventListener("DOMContentLoaded",() => {
      this.panel = document.getElementById("debug")!;
      this.hormones_panel =  this.panel?.querySelector(".hormones");
      this.confidence_panel = this.panel?.querySelector(".confidence");
      this.maturity_panel =  this.panel?.querySelector(".maturity");
      this.knowledge_panel =  this.panel?.querySelector(".knowledge");
      this.has_initialized = true; 
    });
  }

  onUpdate(): void {
    this.updateResourceValue(this.hormones_panel, hormones);
    this.updateResourceValue(this.confidence_panel, confidence);
    this.updateResourceValue(this.maturity_panel, maturity);
    this.updateResourceValue(this.knowledge_panel, knowledge);
  };

  updateResourceValue(resource_element: HTMLElement | null, resource: ResourceDetails): void {
    if(resource_element) {
      const fill_inner = resource_element.querySelector(".fill-inner") as HTMLElement;
        fill_inner.style.transform = `translateX(${-100 + (resource.quantity / resource.limit) * 100}%)`;
    }
  }


  onEnter?: Function | undefined;
  onLeave?: Function | undefined;
}