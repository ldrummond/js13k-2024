import { click_duration, click_offset, globals, resource_map, Resources, sprite_border_color, sprite_border_hover_color, sprite_purchased_limit_color, sprite_too_expensive_border_color, tooltip_timeout } from "./constants";
import Sprite from "./sprite";
import {  dupeCanvas, ranRGB, replaceColor } from "./utils";
import { addToHitmask } from "./hitmask";
import { SpriteData } from "@/core/sprite";
import { playSoundFn } from "./game-audio";

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
  limit?: number;
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
  purchase_limit?: number;
  clickSoundFn?: (v: number) => number;
  onClick?: () => void;
  onPurchase?: () => void;
  hidden?: boolean;
  is_selected?: boolean;
}

interface InteractiveCanvases {
  main_canvas: HTMLCanvasElement;
  hover_canvas: HTMLCanvasElement;
  cooldown_canvas: HTMLCanvasElement;
  locked_canvas: HTMLCanvasElement;
  click_canvas: HTMLCanvasElement; 
  at_limit_canvas: HTMLCanvasElement;
  too_expensive_hover_canvas: HTMLCanvasElement
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
  onPurchase?: () => void; 
  clickSoundFn?: (v: number) => number;
  elapsed_cooldown_percent: number = 0;
  hover_start: number = 0;
  last_clicked?: number;
  purchase_count: number = 0;
  purchase_limit?: number;
  is_too_expensive = false;
  is_hovering = false;
  is_clicking = false;
  is_selected? = false;
  became_available = false; 
  hidden: boolean;

  constructor(opts: GameEntityParams) {
    const { 
      name, 
      description, 
      cooldown_duration, 
      state, 
      cost,
      gain, 
      purchase_limit, 
      onClick, 
      onPurchase, 
      clickSoundFn,
      sprite_data, 
      is_selected,
      hidden = false, 
     } = opts;

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
    this._onClick = onClick;
    this.onPurchase = onPurchase;
    this.clickSoundFn = clickSoundFn;
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
  becomeAvailable() {
    if(this.state === GameEntityState.LOCKED) this.state = GameEntityState.AVAILABLE;
    this.became_available = true; 

    setTimeout(() => {
      this.became_available = false;
    }, 150);
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

      // 
      // HOVER LAYER
      // 
      replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_border_hover_color);
      interactive_canvases.hover_canvas = dupeCanvas(temp_canvas)[0];
      // 

      // 
      // AT LIMIT LAYER
      // 
      replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_purchased_limit_color);
      interactive_canvases.at_limit_canvas = dupeCanvas(temp_canvas)[0];
      replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_border_color);
      // 

      // 
      // TOO EXPENSIVE LAYER
      // 
      replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_too_expensive_border_color);
      temp_ctx.fillStyle = 'rgba(0,0,0,0.5)';
      temp_ctx.fillRect(0, 0, this.w, this.h);
      interactive_canvases.too_expensive_hover_canvas = dupeCanvas(temp_canvas)[0];
      // replaceColor(temp_canvas, temp_ctx, sprite_too_expensive_border_color, sprite_border_color);

      // Redraw the sprite
      temp_ctx.globalCompositeOperation = 'source-over';
      temp_ctx.drawImage(canvas, 0, 0);
      temp_ctx.globalCompositeOperation = "source-atop";


      // 
      // COOLDOWN LAYER
      // 
      // Darken with darkgrey
      temp_ctx.fillStyle = 'rgba(0,0,0,0.4)';
      temp_ctx.fillRect(0, 0, this.w, this.h);
      
      // Duplicate canvas to darkgrey
      interactive_canvases.cooldown_canvas = dupeCanvas(temp_canvas)[0];

      // 
      // LOCKED LAYER
      // 
      // Darken with black
      temp_ctx.fillStyle = 'rgba(0,0,0,0.7)';
      temp_ctx.fillRect(0, 0, this.w, this.h);

      // Duplicate canvas to black
      interactive_canvases.locked_canvas = dupeCanvas(temp_canvas)[0];
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
      globals.hovering_entity = undefined;
    }
    this.is_hovering = is_hovering;
    const is_past_tooltip_predelay = (now - this.hover_start) > tooltip_timeout;

    // Show tooltip
    if(is_hovering && this.state !== GameEntityState.LOCKED) {
      globals.cursor = 'pointer';

      if(is_past_tooltip_predelay && this.name) {
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

  /**
   * 
   * @returns 
   */
  onClick() {
    // Handle click 
    const at_purchase_limit = this.purchase_limit && (this.purchase_count >= this.purchase_limit);
    if(this.is_clicking || this.state === GameEntityState.COOLDOWN || at_purchase_limit) return; 
    this.is_clicking = true; 

    // Click callback 
    if(this._onClick) this._onClick();

    // Play sound
    if(this.clickSoundFn) playSoundFn(this.clickSoundFn);

    // Stop click
    setTimeout(() => {
      this.is_clicking = false; 
    }, click_duration);

    // 
    // Handle PURCHASE
    const can_purchase = this.state === GameEntityState.AVAILABLE && !this.is_too_expensive && !at_purchase_limit;
    // 
    // 
    if(can_purchase) {
      this.purchase_count += 1;

      // Add cooldown
      if(this.cooldown_duration) {
        this.last_clicked = Date.now();
        this.state = GameEntityState.COOLDOWN;
      }

      // Apply Cost
      if(this.cost) {
        Object.entries(this.cost).map(entry => {
          const [resource, resource_cost_details] = entry as unknown as [Resources, EntityTransactionDetail];
          resource_map[resource].quantity -= resource_cost_details.quantity || 0;
          resource_map[resource].increase_per_second -= resource_cost_details.per_second || 0;
        });
      }

      // Apply gain
      if(this.gain) {
        Object.entries(this.gain).map(entry => {
          const [resource, resource_gain_details] = entry as unknown as [Resources, EntityTransactionDetail];
          const resource_details = resource_map[resource];
          const quantity_change = resource_gain_details.quantity || 0;
          const ps_change = resource_gain_details.per_second || 0;
          const limit_change = resource_gain_details.limit || 0;
          resource_details.quantity += quantity_change;
          resource_details.increase_per_second += ps_change;
          resource_details.limit += limit_change; 

          if(globals.ui_text) {
            globals.ui_text.renderGainTooltip(resource_details, quantity_change, ps_change, limit_change);
          }
        });
      }

      // Purchase callback
      if(this.onPurchase) this.onPurchase();
    }
  }

  /**
   * 
   * @param ctx 
   * @returns 
   */
  render(ctx: CanvasRenderingContext2D) {
    if(this.hidden) return; 
    let canvas_to_render = this.active_interactive_canvases.main_canvas;
    let y = this.y;
    let h = this.h;
    let cw = canvas_to_render.width;
    let ch = canvas_to_render.height;

    // Purchase limit
    const at_purchase_limit = this.purchase_limit && this.purchase_count >= this.purchase_limit;
    const is_locked_or_selected = (this.state === GameEntityState.LOCKED) || this.is_selected;
    
    // Decide what to render
    if(is_locked_or_selected) {
      canvas_to_render = this.active_interactive_canvases.locked_canvas;
    }
    else if(this.became_available) {
      // Flash white
      canvas_to_render = this.active_interactive_canvases.click_canvas;
    }
    else if(this.is_too_expensive) {
      if(this.is_hovering) {
        canvas_to_render = this.active_interactive_canvases.too_expensive_hover_canvas;
      }
      else {
        canvas_to_render = this.active_interactive_canvases.cooldown_canvas;
      }
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
    else if(at_purchase_limit) {      
      canvas_to_render = this.active_interactive_canvases.at_limit_canvas;
    }
    else if(this.is_hovering) {
      canvas_to_render = this.active_interactive_canvases.hover_canvas;
    }
    if(this.is_hovering && this.is_selected) {
      canvas_to_render = this.active_interactive_canvases.hover_canvas;
    }

    ctx.drawImage(canvas_to_render, 0, 0, cw, ch, this.x, y, this.w, h);
  }
}