import { click_duration, click_offset, createResourceTooltip, globals, resource_map, Resources, sprite_border_color, sprite_border_hover_color, tooltip_timeout } from "./constants";
import Sprite from "./sprite";
import {  dupeCanvas, ranRGB, replaceColor } from "./utils";
import { addToHitmask } from "./hitmask";
import { SpriteData } from "@/core/sprite";

export const enum GameEntityState {
  "LOCKED",
  "AVAILABLE",
  "FLASHING",
  "HOVERING",
  "CLICKING",
  "COOLDOWN",
}

export interface EntityTransactionDetail {
  quantity?: number;
  per_second?: number;
}

export interface EntityCost {
  [Resources.HORMONES]?: EntityTransactionDetail;
  [Resources.MATURITY]?: EntityTransactionDetail;
  [Resources.CONFIDENCE]?: EntityTransactionDetail;
  [Resources.KNOWLEDGE]?: EntityTransactionDetail;
}

export interface EntityGain {
  [Resources.HORMONES]?: EntityTransactionDetail;
  [Resources.MATURITY]?: EntityTransactionDetail;
  [Resources.CONFIDENCE]?: EntityTransactionDetail;
  [Resources.KNOWLEDGE]?: EntityTransactionDetail;
}

export interface GameEntityParams {
  name?: string;
  description?: string;
  state: GameEntityState;
  cooldown_duration?: number;
  cost?: EntityCost;
  gain?: EntityGain;
  sprite_data: SpriteData;
  is_one_time_purchase?: boolean; 
  purchase_limit?: number;
  onClick?: () => void;
  hidden?: boolean;
  is_selected?: boolean;
}

interface InteractiveCanvases {
  main_canvas: HTMLCanvasElement;
  hover_canvas: HTMLCanvasElement;
  cooldown_canvas: HTMLCanvasElement;
  locked_canvas: HTMLCanvasElement;
  click_canvas: HTMLCanvasElement; 
}

/**
 * 
 */
export class GameEntity extends Sprite {
  name?: string;
  description?: string;
  state: GameEntityState;
  cooldown_duration?: number;
  cost?: EntityCost;
  gain?: EntityGain;
  sprite_data: SpriteData;
  sprite?: Sprite;
  hitmask_color: string;
  sprite_frames_interactive_canvases: InteractiveCanvases[] = [];
  active_interactive_canvases: InteractiveCanvases;
  _onClick?: () => void;
  elapsed_cooldown_percent: number = 0;
  hover_start: number = 0;
  last_clicked?: number;
  purchase_count: number = 0;
  purchase_limit?: number;
  is_one_time_purchase = false; 
  is_too_expensive = false;
  is_hovering = false;
  is_clicking = false;
  is_selected? = false;
  on_cooldown = false;
  hidden: boolean;

  constructor(opts: GameEntityParams) {
    const { name, description, cooldown_duration, state, cost, gain, is_one_time_purchase, purchase_limit, onClick, sprite_data, hidden = false, is_selected } = opts;

    // Init sprite
    super(sprite_data);

    // Add Entity values
    this.name = name; 
    this.description = description;
    this.cooldown_duration = cooldown_duration;
    this.state = state;
    this.cost = cost;
    this.gain = gain;
    if(typeof purchase_limit === 'number' && purchase_limit > 0) this.purchase_limit = purchase_limit;
    this.is_one_time_purchase = !!is_one_time_purchase;
    this._onClick = onClick;
    this.sprite_data = sprite_data;
    this.hitmask_color = ranRGB();
    this.hidden = hidden;
    this.is_selected = is_selected;

    this.preRenderCanvases();
    this.active_interactive_canvases = this.sprite_frames_interactive_canvases[0];
  }

  /**
   * 
   */
  preRenderCanvases() {
    this.sprite_frame_canvases.map(canvas => {
      const [temp_canvas, temp_ctx] = dupeCanvas(canvas);
      
      const interactive_canvases: any = {};
      interactive_canvases.main_canvas = canvas;

      // Add additional canvases for hover, hitmask, etc.
      // TODO: Save restore magic, simplify all this
      // 

      // 
      // HITMASK LAYER
      // Fill with entity hitmask color
      temp_ctx.globalCompositeOperation = "source-over";
      temp_ctx.fillStyle = this.hitmask_color;
      temp_ctx.fillRect(0, 0, this.w, this.h);

      // Mask out the sprite
      temp_ctx.globalCompositeOperation = "destination-in";
      temp_ctx.drawImage(canvas, 0, 0);

      // Send to hitmask
      addToHitmask(temp_canvas, this.x, this.y, this.w, this.h);
      // 
      // 

      // Redraw the sprite
      temp_ctx.globalCompositeOperation = "source-atop";
      temp_ctx.drawImage(canvas, 0, 0);
      // document.body.append(canvas);

      // 
      // HOVER LAYER
      // 
      replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_border_hover_color);
      interactive_canvases.hover_canvas = dupeCanvas(temp_canvas)[0];
      replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_border_color);
      // document.body.append(interactive_canvases.hover_canvas);
      // 

      // 
      // COOLDOWN LAYER
      // 
      // Darken with darkgrey
      temp_ctx.fillStyle = 'rgba(0,0,0,0.5)';
      temp_ctx.fillRect(0, 0, this.w, this.h);
      
      // Duplicate canvas to darkgrey
      interactive_canvases.cooldown_canvas = dupeCanvas(temp_canvas)[0];
      // document.body.append(interactive_canvases.cooldown_canvas);

      // 
      // LOCKED LAYER
      // 
      // Darken with black
      temp_ctx.fillStyle = 'rgba(0,0,0,0.7)';
      temp_ctx.fillRect(0, 0, this.w, this.h);

      // Duplicate canvas to black
      interactive_canvases.locked_canvas = dupeCanvas(temp_canvas)[0];
      // document.body.append(interactive_canvases.locked_canvas);
      // 

      // Redraw the sprite
      temp_ctx.drawImage(canvas, 0, 0);

      // 
      // CLICK LAYER
      // 
      // Lighten with white
      replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_border_hover_color);
      temp_ctx.fillStyle = 'rgba(255,200,200,0.6)';
      temp_ctx.fillRect(0, 0, this.w, this.h);

      // Duplicate canvas to white
      interactive_canvases.click_canvas = dupeCanvas(temp_canvas)[0];
      replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_border_color);
      // 

      // Redraw the sprite
      temp_ctx.clearRect(0,0, this.w, this.h);
      temp_ctx.globalCompositeOperation = "source-over";
      temp_ctx.drawImage(canvas, 0, 0);

      // Add canvases
      this.sprite_frames_interactive_canvases.push(interactive_canvases as InteractiveCanvases);
    });
  }

  /**
   * 
   */
  onUpdate() {
    const now = Date.now();
    const is_hovering = this.hitmask_color === globals.hitmask_active_color;
    
    // Start hovering
    if(!this.is_hovering && is_hovering) {
      this.hover_start = now;
      globals.hovering_entity = this; 
    }
    // Stop hovering
    if(this.is_hovering && !is_hovering) {
      globals.active_message = ''; 
      globals.hovering_entity = undefined;
    }
    this.is_hovering = is_hovering;
    const is_past_tooltip_predelay = (now - this.hover_start) > tooltip_timeout;

    // Show tooltip
    if(is_hovering && this.state !== GameEntityState.LOCKED) {
      globals.cursor = 'pointer';

      if(is_past_tooltip_predelay && this.name) {
        globals.active_message = this.name;
        globals.active_entity = this; 
      }
    }
    
    // For locked entitites
    if(this.cost) {
      const cost = this.cost!;
      
      // Determine if cost is greater than current value
      let too_expensive = false;
      
      Object.entries(cost).map(entry => {
        const [resource, resource_cost_details] = entry as unknown as [Resources, EntityTransactionDetail];
        if(resource_cost_details.quantity && resource_map[resource].quantity < resource_cost_details.quantity) {
          too_expensive = true;
        }
        if(resource_cost_details.per_second && resource_map[resource].increase_per_second < resource_cost_details.per_second) {
          too_expensive = true;
        }
      });

      this.is_too_expensive = too_expensive;
    }

    // For entities with a cooldown
    if(this.last_clicked && this.cooldown_duration) {
      this.elapsed_cooldown_percent = (now - this.last_clicked) / this.cooldown_duration;    
      const on_cooldown = (this.state === GameEntityState.COOLDOWN);
      const past_cooldown_duration = this.elapsed_cooldown_percent > 1;
  
      if(on_cooldown && past_cooldown_duration) {
        this.state = GameEntityState.AVAILABLE;
      }
    }
  }

  onClick() {
    if(this.is_clicking || (this.is_one_time_purchase && this.last_clicked) || (this.purchase_limit && (this.purchase_count >= this.purchase_limit))) return; 

    // PURCHASE
    if(this.state === GameEntityState.AVAILABLE) {
      this.is_clicking = true; 

      // Add cooldown
      if(this.cooldown_duration) {
        this.last_clicked = Date.now();
        this.state = GameEntityState.COOLDOWN;
      }

      // TODO: Add cost

      // Animate gain
      this.purchase_count += 1;
      if(this.gain) {
        Object.entries(this.gain).map(entry => {
          const [resource, resource_gain_details] = entry as unknown as [Resources, EntityTransactionDetail];
          resource_map[resource].quantity += resource_gain_details.quantity || 0;
          resource_map[resource].increase_per_second += resource_gain_details.per_second || 0;
          createResourceTooltip(resource, this.x + (this.w / 2), this.y);
        });
      }
      
      if(this._onClick) this._onClick();

      setTimeout(() => {
        this.is_clicking = false; 
      }, click_duration);
    }
  }

  // TODO: Use global main_ctx
  render(ctx: CanvasRenderingContext2D) {
    if(this.hidden) return; 
    let canvas_to_render = this.active_interactive_canvases.main_canvas;
    let y = this.y;
    let h = this.h;
    let cw = canvas_to_render.width;
    let ch = canvas_to_render.height;

    // Decide what to render
    if(this.state === GameEntityState.LOCKED || this.is_selected) {
      canvas_to_render = this.active_interactive_canvases.locked_canvas;
    }
    else if(this.is_too_expensive) {
      canvas_to_render = this.active_interactive_canvases.cooldown_canvas;
    }
    else if(this.is_clicking) {
      y += click_offset;
      canvas_to_render = this.active_interactive_canvases.click_canvas;
    }
    else if(this.last_clicked && this.cooldown_duration && this.state === GameEntityState.COOLDOWN) {
      ctx.drawImage(this.active_interactive_canvases.cooldown_canvas, this.x, y, this.w, h);

      const cooldown_anim_percent = Math.min((Date.now() - this.last_clicked  - click_duration) / (this.cooldown_duration - click_duration), 1);    
      ch *= cooldown_anim_percent;
      h *= cooldown_anim_percent;
    }
    else if(this.is_hovering || (this.is_one_time_purchase && this.last_clicked)) {
      canvas_to_render = this.active_interactive_canvases.hover_canvas;
    }
    if(this.is_hovering && this.is_selected) {
      canvas_to_render = this.active_interactive_canvases.hover_canvas;
    }

    ctx.drawImage(canvas_to_render, 0, 0, cw, ch, this.x, y, this.w, h);
  }
}