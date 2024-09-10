
// Functions

import { pixel_size } from "./constants";

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
export function dupeCanvas(canvas: HTMLCanvasElement) {
  const new_canvas = canvas.cloneNode() as HTMLCanvasElement;
  const new_ctx = new_canvas.getContext('2d');
  new_ctx?.drawImage(canvas,0,0);
  return new_canvas;
}

// 
export function htmlFromString(html_string: string) {
  const temp = document.createElement("a");
  temp.innerHTML = html_string;
  return temp.children[0];
}

// 
export function replaceColor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color_a: rgb, color_b: rgb) {
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
  x = 0,
  y = 0,
  w: number, 
  h: number, 
  hsl: hsl,
  variance = 12,
  border_width?: number
) {
  const pixel_count_w = Math.ceil(w / pixel_size);
  const pixel_count_h = Math.ceil(h / pixel_size);
  const border_pixel_size = (border_width || 1) / pixel_size; 

  // If border width, only fill for border
  if(!border_width) {
    ctx.fillStyle = ranHSL(hsl, 0);
    ctx.fillRect(x, y, pixel_count_w * pixel_size, pixel_count_h * pixel_size);
  }

  for (let c = 0; c <= pixel_count_w; c++) {
    for(let r = 0; r <= pixel_count_h; r++) {
      const within_border = c <= border_pixel_size || c >= pixel_count_w - border_pixel_size || r <= border_pixel_size || r >= pixel_count_h - border_pixel_size;
      if(!border_width || within_border) {
        // TODO: Change to 0,0,0
        ctx.fillStyle = ranHSL(hsl, Math.random() > 0.8 ? variance : 0);
        ctx.fillRect(c * pixel_size + x, r * pixel_size + y, pixel_size * 1, pixel_size * 1);
      } 
    }
  }
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

// 
// 
export function createPattern(
  w: number = 10, 
  h: number = 10, 
  hsl: hsl,
  variance?: number,
): CanvasPattern {

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.style.imageRendering = 'pixelated';
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  canvas.style.width = '100px';
  canvas.style.height = '100px';

  // TODO: Delete
  // document.body.append(canvas);
  // canvas.style.background = 'blue';

  // TODO: Combine these two?
  for (let c = 0; c < w; c++) {
    for (let r = 0; r < h; r++) {
      ctx.fillStyle = ranHSL(hsl, Math.random() > 0.8 ? variance : 0);
      ctx.fillRect(c, r, 1, 1); 
    }
  }

  return ctx.createPattern(canvas, "repeat")!;
}
