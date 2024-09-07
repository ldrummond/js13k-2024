import { spritesheet } from "@/spritesheet";
import { canvasFromSpritesheet } from "./sprite";

//
function fillText(ctx: CanvasRenderingContext2D, text: string, x: number = 0, y: number = 0, size: number = 1) {
  // TODO: Remove
  ctx.font = `${size}px monospace`;
  ctx.fillText(text, x, y);

  // 
  
  [...text].map((char,i) => {
    const code = text.charCodeAt(i)
    console.log(code);
  });
}

const {canvas, ctx} = canvasFromSpritesheet(spritesheet.text);
document.body.append(canvas);
fillText(ctx, "abcdABCD");