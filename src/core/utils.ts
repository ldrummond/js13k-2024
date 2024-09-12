
// Functions

import { base_canvas, pixel_size, spritesheet_img } from "./constants";

export function percentOfRange(percent: number, lower_bound: number, upper_bound: number): number {
  return lower_bound + (percent) * (upper_bound - lower_bound);
}

export function arrFull(x: number): number[] {
  return Array(x).fill(x);
}

// 
export function ranInt(v: number) {
  return Math.round(Math.random() * v);
}

// 
// 
export function ranRGB() {
  return `rgb(${ranInt(255)},${ranInt(255)},${ranInt(255)})`;
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
    if(rgb+'' == color_a+'') {
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
  pixel_size_overrite?: number
) {
  const pixel_size_to_use = pixel_size_overrite || pixel_size; 
  const pixel_count_w = Math.ceil(w / pixel_size_to_use);
  const pixel_count_h = Math.ceil(h / pixel_size_to_use);
  const border_pixel_size = (border_width || 1) / pixel_size_to_use; 

  // If border width, only fill for border
  const no_border = !border_width;
  if(no_border) {
    ctx.fillStyle = ranHSL(hsl, 0);
    ctx.fillRect(x || 0, y || 0, Math.ceil((pixel_count_w + 1) * pixel_size_to_use), Math.ceil((pixel_count_h + 1) * pixel_size_to_use));
  };

  for (let c = 0; c <= pixel_count_w; c++) {
    for(let r = 0; r <= pixel_count_h; r++) {
      const within_border = c <= border_pixel_size || c >= pixel_count_w - border_pixel_size || r <= border_pixel_size || r >= pixel_count_h - border_pixel_size;
      if(no_border || within_border) {
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
 * @param rect 
 * @param canvas_width 
 * @param canvas_height 
 * @returns 
 */
export function canvasFromSpritesheet(rect: Rect, cw?: number, ch?: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  console.log('Sprite Text Init Src: INNER: ', rect);
  console.log('canvas from spritesheet', rect, base_canvas.width, base_canvas.height, cw, ch);
  
  const [canvas,ctx] = dupeCanvas(base_canvas);

  const w = typeof cw === 'number' ? cw : rect['w'];
  const h = typeof ch === 'number' ? ch : rect['h'];
  canvas.width = w;
  canvas.height = h;
  
  ctx.drawImage(spritesheet_img, rect['x'], rect['y'], rect['w'], rect['h'], 0, 0, w, h);
  return [canvas, ctx];
}

// /**
//  * 
//  */
// export function fillRectWithStalagtites(
//   ctx: CanvasRenderingContext2D,
//   x = 0,
//   y = 0,
//   w: number, 
//   h: number, 
//   hsl: hsl,
// ) {
//   const pixel_count_w = Math.ceil(w / pixel_size);
//   const pixel_count_h = Math.ceil(h / pixel_size);
//   ctx.fillStyle = `hsl(${hsl[0]}, ${hsl[1]}, ${hsl[2]})`;

//   // If border width, only fill for border
//   let r = 0;
//   let c = 0;
//   let stalagtites = [2, 5, 3, 3];
//   while(r < pixel_count_h) {
//     while(c < pixel_count_w) {
//       c++; 
//       const should_start_stalagtite = (r === 0 && Math.random() > 0.6);
//       if(should_start_stalagtite) {
//         const stalagtite_base_width = Math.round(Math.random() * pixel_count_w);

//       }
//     }
//     r++; 
//     c = 0; 
//   }

//   for(let r = 0; r <= pixel_count_h; r++) {
//     for (let c = 0; c <= pixel_count_w; c++) {
//       if(should_start_stalagtite) {
//         ctx.fillRect(c * (pixel_size * ) + x, r * pixel_size + y, pixel_size * 1, pixel_size * 1);
//       } else if(r < 1)
//     }
//   }
// }
