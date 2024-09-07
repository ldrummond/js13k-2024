import { click_duration, click_offset, confidence, createResourceTooltip, globals, hormones, knowledge, maturity, resource_map, Resources, spritesheet_img, tooltip_timeout } from "./constants";
import Sprite from "./sprite";
import { dupeCanvas, ranRGB } from "./utils";
import { addToHitmask } from "./hitmask";
import { spritesheet } from "@/spritesheet";

enum GameEntityState {
  "LOCKED",
  "AVAILABLE",
  "FLASHING",
  "HOVERING",
  "CLICKING",
  "COOLDOWN"
}

interface EntityCost {
  [Resources.HORMONES]?: number;
  [Resources.MATURITY]?: number;
  [Resources.CONFIDENCE]?: number;
  [Resources.KNOWLEDGE]?: number;
}

export interface EntityGainDetail {
  quantity?: number;
  per_second?: number;
}

export interface EntityGain {
  [Resources.HORMONES]?: EntityGainDetail;
  [Resources.MATURITY]?: EntityGainDetail;
  [Resources.CONFIDENCE]?: EntityGainDetail;
  [Resources.KNOWLEDGE]?: EntityGainDetail;
}

interface GameEntityParams {
  name: string;
  description: string;
  state: GameEntityState;
  cooldown_duration?: number;
  cost?: EntityCost;
  gain: EntityGain;
  sprite_data: SpriteData;
  is_one_time_purchase?: boolean; 
  onClick?: () => void;
}

export const game_entities_data: GameEntityParams[] = [
  {
    // TODO: Simplify locked vs click
    name: "pituitary",
    description: "starts hormone production.",
    // cooldown_duration: 2000,
    state: GameEntityState.AVAILABLE,
    cost: {
      [Resources.HORMONES]: 10
    },
    gain: {
      [Resources.HORMONES]: {
        per_second: 0.5
      }
    },
    onClick() {
    },
    is_one_time_purchase: true,
    sprite_data: {
      interactive: true,
      x: 125,
      y: 190,
      w: 40,
      name: "minion",
      spritesheet_rect: spritesheet.minion
    },
  },
  {
    name: "brain",
    description: "Internal logic center",
    cooldown_duration: 1000,
    state: GameEntityState.AVAILABLE, 
    gain: {
      [Resources.HORMONES]: {
        quantity: 10
      }
    },
    onClick() {
    },
    sprite_data: {
      interactive: true,
      x: 110,
      y: 140,
      w: 80,
      name: "avatar",
      spritesheet_rect: spritesheet.avatar
    },
  },
  {
    name: "hair",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    onClick() {
      // game_data.hormones.increase_per_second += 0.1;
    },
    sprite_data: {
      interactive: true,
      x: 20,
      y: 30,
      w: 60,
      name: "character-alt 0",
      spritesheet_rect: spritesheet["character-alt 0"]
    },
  },
  {
    name: "horns",
    description: "null",
    cooldown_duration: 2000,
    state: GameEntityState.LOCKED, 
    gain: {
      [Resources.MATURITY]: {
        per_second: 1
      }
    },
    onClick() {
      // game_data.hormones.increase_per_second += 0.1;
    },
    sprite_data: {
      interactive: true,
      x: 20,
      y: 30,
      w: 60,
      name: "character-alt 0",
      spritesheet_rect: spritesheet["character-alt 0"],
    },
  },
];

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

    // Add additional canvases for hover, hitmask, etc.
    // TODO: Save restore magic, simplify all this
    // 
    // Fill with entity hitmask color
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = this.hitmask_color;
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Mask out the sprite
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.drawImage(spritesheet_img, spritesheet_rect.x, spritesheet_rect.y, spritesheet_rect.w, spritesheet_rect.h, 0, 0, spritesheet_rect.w, spritesheet_rect.h);

    // Send to hitmask
    addToHitmask(this.canvas, this.x, this.y, this.w, this.h);

    // Redraw the sprite
    this.ctx.globalCompositeOperation = "source-atop";
    this.ctx.drawImage(spritesheet_img, spritesheet_rect.x, spritesheet_rect.y, spritesheet_rect.w, spritesheet_rect.h, 0, 0, spritesheet_rect.w, spritesheet_rect.h);
    document.body.append(this.canvas);
  
    // Darken with grey
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Duplicate canvas to grey
    this.hover_canvas = dupeCanvas(this.canvas);
    document.body.append(this.hover_canvas);

    // Darken with darkgrey
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillRect(0, 0, this.w, this.h);
    
    // Duplicate canvas to darkgrey
    this.cooldown_canvas = dupeCanvas(this.canvas);
    document.body.append(this.cooldown_canvas);

    // Darken with black
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Duplicate canvas to black
    this.locked_canvas = dupeCanvas(this.canvas);
    document.body.append(this.locked_canvas);

    // Redraw the sprite
    this.ctx.drawImage(spritesheet_img, spritesheet_rect.x, spritesheet_rect.y, spritesheet_rect.w, spritesheet_rect.h, 0, 0, spritesheet_rect.w, spritesheet_rect.h);

    // Lighten with white
    this.ctx.fillStyle = 'rgba(255,200,200,0.6)';
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Duplicate canvas to white
    this.click_canvas = dupeCanvas(this.canvas);
    document.body.append(this.click_canvas);

    // Redraw the sprite
    this.ctx.clearRect(0,0, this.w, this.h);
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.drawImage(spritesheet_img, spritesheet_rect.x, spritesheet_rect.y, spritesheet_rect.w, spritesheet_rect.h, 0, 0, spritesheet_rect.w, spritesheet_rect.h);
  }

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
    
    // Show tooltip
    if(is_hovering && (now - this.hover_start) > tooltip_timeout) {
      globals.active_message = this.name;
      globals.active_entity = this; 
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

      // Gain
      // TODO: function this
      
      // game_data.hormones.value += this.gain.hormones?.quantity || 0;
      // game_data.hormones.increase_per_second += this.gain.hormones?.per_second || 0;
      // game_data.confidence.value += this.gain.confidence?.quantity || 0;
      // game_data.confidence.increase_per_second += this.gain.confidence?.per_second || 0;
      // game_data.knowledge.value += this.gain.knowledge?.quantity || 0;
      // game_data.knowledge.increase_per_second += this.gain.knowledge?.per_second || 0;
      // game_data.maturity.value += this.gain.maturity?.quantity || 0;
      // game_data.maturity.increase_per_second += this.gain.maturity?.per_second || 0;

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

    // Cleanup
    // main_ctx.clearRect(this.x, y - click_offset, this.w, this.h + click_offset * 2);

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