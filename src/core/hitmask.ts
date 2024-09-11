import { dpr, globals, hitmask_canvas, container } from "./constants";
import { debugLog } from "./utils";

const hitmask_ctx = hitmask_canvas.getContext('2d', {willReadFrequently: true})!;
hitmask_ctx.scale(dpr, dpr);

// TODO: Remove
hitmask_canvas.id = 'hitmask';
container.prepend(hitmask_canvas);
hitmask_canvas.style.opacity = "0";
// 

/**
 * 
 */
export function addToHitmask(canvas: HTMLCanvasElement, x: number, y: number, w: number, h: number) {
  debugLog(canvas, 'hitmask');
  hitmask_ctx.drawImage(canvas, x, y, w, h);
}

export function hitmaskUpdate() {
  const hitmask_rect = hitmask_canvas.getBoundingClientRect();
  const x = (globals.mousepos.x - hitmask_rect.left) * dpr;
  const y = (globals.mousepos.y - hitmask_rect.top) * dpr;
  debugLog(hitmask_canvas, 'hitmask');
  const data = hitmask_ctx.getImageData(x, y, 1, 1).data;
  globals.hitmask_active_color = `rgb(${data[0]},${data[1]},${data[2]})`;
}