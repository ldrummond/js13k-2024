
// Functions

import { base_canvas, globals, pixel_size, resource_map, Resources, spritesheet_img } from "./constants";
import { GameEntity, EntityTransactionDetail } from "./game-entity";

export function percentOfRange(percent: number, lower_bound: number, upper_bound: number): number {
  return lower_bound + (percent) * (upper_bound - lower_bound);
}

export function arrFull(x: number): number[] {
  return Array(x).fill(x);
}

export function arrRan<T>(arr: T[]): T {
  return arr[Math.floor(Math.random()*arr.length)];
}

// 
export function ranInt(v: number) {
  return Math.round(Math.random() * v);
}

// 
// 
export function ranRGB(): rgb {
  return [ranInt(255), ranInt(255), ranInt(255)];
}

export function rgbMatch(a_rgb: rgb, b_rgb: rgb, threshold = 2): boolean {
  const r_diff = a_rgb[0] - b_rgb[0];
  const g_diff = a_rgb[1] - b_rgb[1];
  const b_diff = a_rgb[2] - b_rgb[2];

  return (Math.abs(r_diff) < threshold && Math.abs(g_diff) < threshold && Math.abs(b_diff) < threshold);
}

// 
// 
export function ranHSL(hsl: hsl, variance: number = 10) {
  const [h, s, l] = hsl;
  return `hsl(${h+(Math.random()-.5)*variance},${s+(Math.random()-.5)*variance}%,${l+(Math.random()-.5)*variance}%)`;
}

// 
// 
export function dupeCanvas(canvas: HTMLCanvasElement): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const new_canvas = canvas.cloneNode() as HTMLCanvasElement;
  const new_ctx = new_canvas.getContext('2d')!;
  new_ctx.drawImage(canvas,0,0);
  new_ctx.imageSmoothingEnabled = false; 
  return [new_canvas, new_ctx];
}

// 
export function htmlFromString(html_string: string) {
  const temp = document.createElement("a");
  temp.innerHTML = html_string;
  return temp.children[0];
}

// 
export function replaceColor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color_a: rgb, color_b: rgb) {
  if(canvas.width < 1 || canvas.height < 1) console.log("Failed to replace color");
  
  let image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pixel_data = image_data.data;
  for (let i = 0; i < pixel_data.length; i += 4) { // red, green, blue, and alpha
    //short way to compare numerical arrays
    const rgb = pixel_data.slice(i,i+3);
    const r_diff = rgb[0] - color_a[0];
    const g_diff = rgb[1] - color_a[1];
    const b_diff = rgb[2] - color_a[2];

    if(Math.abs(r_diff) < 3 && Math.abs(g_diff) < 3 && Math.abs(b_diff) < 3) {
      pixel_data[i] = color_b[0];
      pixel_data[i+1] = color_b[1];
      pixel_data[i+2] = color_b[2];
    }
  }
  
  ctx.putImageData(image_data, 0, 0);
}

// 
// 
export function roundToPixel(v: number) {
  return Math.ceil(v / pixel_size) * pixel_size;
}

export function pointInRect(x: number, y: number, r: Rect) {
  return x > r['x'] && x < (r['x'] + r['w']) && y > r['y'] && y < (r['y'] + r['h']);
}

//
// 
export function cantAffordEntity(entity: GameEntity): boolean {
  const entity_cost = entity.cost;
  let too_expensive = false;

  if(!entity_cost) return false;

  Object.entries(entity_cost).map(entry => {
    const [resource, resource_cost_details] = entry as unknown as [Resources, EntityTransactionDetail];
    if(resource_cost_details.quantity && resource_map[resource].quantity < resource_cost_details.quantity) {
      too_expensive = true;
    }
    if(resource_cost_details.per_second && resource_map[resource].increase_per_second < resource_cost_details.per_second) {
      too_expensive = true;
    }
  });

  return too_expensive;
}

// 
// 
export function canAffordResourceTransaction(global_resource: ResourceDetails, transaction_cost: EntityTransactionDetail): boolean {
  return !!(
    (transaction_cost.quantity && global_resource.quantity > transaction_cost.quantity) ||
    (transaction_cost.per_second && global_resource.increase_per_second > transaction_cost.per_second) 
  );
}

// 
// 
// CHATGPT
export function deepEqual(obj1: any, obj2: any): boolean {
  // Check for strict equality (handles primitives and reference equality)
  if (obj1 === obj2) {
      return true;
  }

  // Check if both are objects
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false; // One is not an object or is null
  }

  // Get object keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Compare number of keys
  if (keys1.length !== keys2.length) {
      return false;
  }

  // Recursively compare each property
  for (const key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
          return false;
      }
  }

  return true;
}


//
// 
export function fillRuleWithRandom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number, 
  hsl: hsl,
  variance = 12,
) {
  const pixel_count_w = Math.ceil(w / pixel_size);
  ctx.fillStyle = ranHSL(hsl, 0);
  ctx.fillRect(x, y, w, pixel_size);

  for (let c = 0; c <= pixel_count_w; c++) {
    const rand = Math.random() > .75;
    if(rand) {
      ctx.fillStyle = ranHSL(hsl, variance);
      ctx.fillRect(c * pixel_size + x, y, pixel_size, pixel_size);
    }
  }
}

// 
// 
export function fillRectWithRandom(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number, 
  h: number, 
  hsl: hsl,
  variance = 12,
  border_width?: number,
  border_inset?: number,
  pixel_size_overrite?: number
) {
  const pixel_size_to_use = pixel_size_overrite || pixel_size; 
  const pixel_count_w = Math.ceil(w / pixel_size_to_use);
  const pixel_count_h = Math.ceil(h / pixel_size_to_use);
  const border_pixel_size = (border_width || 1); 
  const border_inset_pixel_size = border_inset ? (border_inset || 1) : 0;

  // If border width, only fill for border
  const no_border = !border_width;
  if(no_border) {
    ctx.fillStyle = ranHSL(hsl, 0);
    ctx.fillRect(x || 0, y || 0, Math.ceil((pixel_count_w + 1) * pixel_size_to_use), Math.ceil((pixel_count_h + 1) * pixel_size_to_use));
  };

  for (let c = 0; c <= pixel_count_w; c++) {
    for(let r = 0; r <= pixel_count_h; r++) {
      const within_border = c <= border_pixel_size || c >= pixel_count_w - border_pixel_size || r <= border_pixel_size || r >= pixel_count_h - border_pixel_size;
      const within_inset = c >= border_inset_pixel_size && c <= pixel_count_w - border_inset_pixel_size && r >= border_inset_pixel_size && r <= pixel_count_h - border_inset_pixel_size;
      if(no_border || (within_border && within_inset)) {
        const rand = Math.random() > 0.75;
        let vari = variance;
        if(border_width) {vari = (rand ? variance : 0);}

        if(rand || (border_width && within_border)) {
          ctx.fillStyle = ranHSL(hsl, vari);
          ctx.fillRect(c * pixel_size_to_use + x, r * pixel_size_to_use + y, pixel_size_to_use, pixel_size_to_use);
        }
      } 
    }
  }
}

/**
 * 
 * @param ctx 
 * @param rect 
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
export function drawSpritesheetImage(ctx: CanvasRenderingContext2D, rect: Rect, x: number, y: number, w: number, h: number) {
  ctx.drawImage(spritesheet_img, rect['x'], rect['y'], rect['w'], rect['h'], x, y, w, h);
};

/**
 * 
 * @param rect 
 * @param canvas_width 
 * @param canvas_height 
 * @returns 
 */
export function canvasFromSpritesheet(rect: Rect, cw?: number, ch?: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const [canvas,ctx] = dupeCanvas(base_canvas);

  const w = typeof cw === 'number' ? cw : rect['w'];
  const h = typeof ch === 'number' ? ch : rect['h'];
  canvas.width = w;
  canvas.height = h;
  
  ctx.drawImage(spritesheet_img, rect['x'], rect['y'], rect['w'], rect['h'], 0, 0, w, h);
  return [canvas, ctx];
}

/**
 * 
 * @param name 
 * @returns 
 */
export function getEntityByName(name: string) {
  return globals.game_entities.find(entity =>  entity.name == name);
}