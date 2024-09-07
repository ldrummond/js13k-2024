
// Functions
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
export function roundToPixel(v: number, _pixel_size: number) {
  return Math.ceil(v / _pixel_size) * _pixel_size;
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
// 
export function createPattern(
  _width: number = 100, 
  _height: number = 100, 
  pixel_width: number = 10,
  pixel_height: number = 10, 
  hsl: hsl,
  variance?: number,
  _canvas?: HTMLCanvasElement,
  _context?: CanvasRenderingContext2D,
): CanvasPattern {

  const canvas = _canvas || document.createElement("canvas");
  canvas.width = _width;
  canvas.height = _height;
  const ctx = _context || canvas.getContext("2d")!;

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, _width, _height);

  for (let c = 0; c < _width / pixel_width; c++) {
    for(let r = 0; r < _height / pixel_height; r++) {
      ctx.fillStyle=ranHSL(hsl,Math.random() > 0.8 ? variance : 0);
      ctx.fillRect(c * pixel_width, r * pixel_height, pixel_width, pixel_height);
    }
  }
  return ctx.createPattern(canvas, "repeat")!;
}

// 
// 
export function fillCanvasWithRandomPixels(
  ctx: CanvasRenderingContext2D,
  x = 0,
  y = 0,
  _pixel_count_width: number, 
  _pixel_count_height: number, 
  _pixel_size: number,
  hsl: hsl,
  variance = 12
) {
  for (let c = 0; c < _pixel_count_width; c++) {
    for(let r = 0; r < _pixel_count_height; r++) {
      // TODO: Change to 0,0,0
      ctx.fillStyle=ranHSL(hsl,Math.random() > 0.8 ? variance : 0);
      ctx.fillRect(c * _pixel_size + x, r * _pixel_size + y, _pixel_size * 1.2, _pixel_size * 1.2);
    }
  }
}