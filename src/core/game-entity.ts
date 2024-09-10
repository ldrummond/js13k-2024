import { click_duration, click_offset, confidence, createResourceTooltip, globals, hormones, knowledge, maturity, resource_map, Resources, sprite_border_color, sprite_border_hover_color, spritesheet_img, tooltip_timeout } from "./constants";
import Sprite from "./sprite";
import { dupeCanvas, ranRGB, replaceColor } from "./utils";
import { addToHitmask } from "./hitmask";
import { SpriteNames, spritesheet } from "@/spritesheet";
import { GameEntityState, EntityCost, EntityGain, GameEntityParams, EntityGainDetail } from "@/data/game-entities";

/**
 * 
 */
export class GameEntity extends Sprite {
  name: string;
  description: string;
  state: GameEntityState;
  cooldown_duration?: number;
  cost?: EntityCost;
  gain: EntityGain;
  sprite_data: SpriteData;
  sprite?: Sprite;
  hitmask_color: string;
  hover_canvas: HTMLCanvasElement;
  cooldown_canvas: HTMLCanvasElement;
  locked_canvas: HTMLCanvasElement;
  click_canvas: HTMLCanvasElement; 
  _onClick?: () => void;
  elapsed_cooldown_percent: number = 0;
  hover_start: number = 0;
  last_clicked?: number;
  is_one_time_purchase = false; 
  is_too_expensive = false;
  is_hovering = false;
  is_clicking = false;
  on_cooldown = false;

  constructor(opts: GameEntityParams) {
    const { name, description, cooldown_duration, state, cost, gain, is_one_time_purchase, onClick, sprite_data } = opts;
    const { spritesheet_rect } = sprite_data;

    // Init sprite
    super(sprite_data);

    // Add Entity values
    this.name = name; 
    this.description = description;
    this.cooldown_duration = cooldown_duration;
    this.state = state;
    this.cost = cost;
    this.gain = gain;
    this.is_one_time_purchase = !!is_one_time_purchase;
    this._onClick = onClick;
    this.sprite_data = sprite_data;
    this.hitmask_color = ranRGB();

    const temp_canvas = dupeCanvas(this.canvas);
    const temp_ctx = temp_canvas.getContext("2d")!;

    // Add additional canvases for hover, hitmask, etc.
    // TODO: Save restore magic, simplify all this
    // 

    // 
    // HITMASK LAYER
    // 
    // Fill with entity hitmask color
    temp_ctx.globalCompositeOperation = "source-over";
    temp_ctx.fillStyle = this.hitmask_color;
    temp_ctx.fillRect(0, 0, this.w, this.h);

    // Mask out the sprite
    temp_ctx.globalCompositeOperation = "destination-in";
    temp_ctx.drawImage(this.canvas, 0, 0);

    // Send to hitmask
    addToHitmask(temp_canvas, this.x, this.y, this.w, this.h);
    // 
    // 

    // Redraw the sprite
    temp_ctx.globalCompositeOperation = "source-atop";
    temp_ctx.drawImage(this.canvas, 0, 0);
    // document.body.append(temp_canvas);

    // 
    // HOVER LAYER
    // 
    replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_border_hover_color);
    this.hover_canvas = dupeCanvas(temp_canvas);
    // document.body.append(this.hover_canvas);
    replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_border_color);
    // 
    // 
    // 

    // 
    // COOLDOWN LAYER
    // 
    // Darken with darkgrey
    temp_ctx.fillStyle = 'rgba(0,0,0,0.5)';
    temp_ctx.fillRect(0, 0, this.w, this.h);
    
    // Duplicate canvas to darkgrey
    this.cooldown_canvas = dupeCanvas(temp_canvas);
    // document.body.append(this.cooldown_canvas);

    // 
    // LOCKED LAYER
    // 
    // Darken with black
    temp_ctx.fillStyle = 'rgba(0,0,0,0.7)';
    temp_ctx.fillRect(0, 0, this.w, this.h);

    // Duplicate canvas to black
    this.locked_canvas = dupeCanvas(temp_canvas);
    // document.body.append(this.locked_canvas);
    // 
    // 
    // 

    // Redraw the sprite
    temp_ctx.drawImage(this.canvas, 0, 0);

    // 
    // CLICK LAYER
    // 
    // Lighten with white
    replaceColor(temp_canvas, temp_ctx, sprite_border_color, sprite_border_hover_color);
    temp_ctx.fillStyle = 'rgba(255,200,200,0.6)';
    temp_ctx.fillRect(0, 0, this.w, this.h);

    // Duplicate canvas to white
    this.click_canvas = dupeCanvas(temp_canvas);
    // document.body.append(this.click_canvas);
    replaceColor(temp_canvas, temp_ctx, sprite_border_hover_color, sprite_border_color);
    // 
    // 
    // 

    // Redraw the sprite
    temp_ctx.clearRect(0,0, this.w, this.h);
    temp_ctx.globalCompositeOperation = "source-over";
    temp_ctx.drawImage(this.canvas, 0, 0);
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
      globals.cursor = 'pointer'

      if(is_past_tooltip_predelay) {
        globals.active_message = this.name;
        globals.active_entity = this; 
      }
    }
    
    // For locked entitites
    if(this.cost) {
      const cost = this.cost!;
      // TODO: function
      this.is_too_expensive = !(
        hormones.quantity >= (cost[Resources.HORMONES] || 0) &&
        confidence.quantity >= (cost[Resources.CONFIDENCE] || 0) &&
        knowledge.quantity >= (this.cost[Resources.KNOWLEDGE] || 0) &&
        maturity.quantity >= (this.cost[Resources.MATURITY] || 0)
      );
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
    if(this.is_clicking || (this.is_one_time_purchase && this.last_clicked)) return; 

    if(this.state === GameEntityState.AVAILABLE) {
      this.last_clicked = Date.now();
      this.is_clicking = true; 
      this.state = GameEntityState.COOLDOWN;

      // Animate gain
      // TODO: Change resource map to resource list 
      // Or add function getResourceByResource
      Object.entries(this.gain).map(entry => {
        const [resource, resource_gain_details] = entry as unknown as [Resources, EntityGainDetail];
        resource_map[resource].quantity += resource_gain_details.quantity || 0;
        resource_map[resource].increase_per_second += resource_gain_details.per_second || 0;
        createResourceTooltip(resource, this.x + (this.w / 2), this.y);
      })
      
      if(this._onClick) this._onClick();

      setTimeout(() => {
        this.is_clicking = false; 
      }, click_duration);
    }
  }

  // TODO: Use global main_ctx
  render(main_ctx: CanvasRenderingContext2D) {
    let canvas_to_render = this.canvas;
    let y = this.y;
    let h = this.h;
    let cw = this.canvas.width;
    let ch = this.canvas.height;

    // Decide what to render
    if(this.state === GameEntityState.LOCKED) {
      canvas_to_render = this.locked_canvas;
    }
    else if(this.is_too_expensive) {
      canvas_to_render = this.cooldown_canvas;
    }
    else if(this.is_clicking) {
      y += click_offset;
      canvas_to_render = this.click_canvas;
    }
    else if(this.last_clicked && this.cooldown_duration && this.state === GameEntityState.COOLDOWN) {
      main_ctx.drawImage(this.cooldown_canvas, this.x, y, this.w, h);

      const cooldown_anim_percent = Math.min((Date.now() - this.last_clicked  - click_duration) / (this.cooldown_duration - click_duration), 1);    
      ch *= cooldown_anim_percent;
      h *= cooldown_anim_percent;
    }
    else if(this.is_hovering || (this.is_one_time_purchase && this.last_clicked)) {
      canvas_to_render = this.hover_canvas;
    }

    main_ctx.drawImage(canvas_to_render, 0, 0, cw, ch, this.x, y, this.w, h);
  }
}