import { canvas_height, canvas_width, container, globals, main_canvas, main_ctx, resource_list, spritesheet_img } from './core/constants';
import DebugPanel from './debug';
import { GameLogic } from './core/game-logic';
import { game_entities_data_list, GameEntity } from './core/game-entity';
import { UIText } from './core/ui-text';
import Sprite, { canvasFromSpritesheet, sprite_data_list } from './core/sprite';
import { hitmaskUpdate } from './core/hitmask';
import { CanvasController } from './core/canvas-controller';
import { sprite_text } from './core/sprite-text';

let previousTime = 0;
const fps = 20;
const interval = 1000 / fps; 


// Load Main Spritesheet
spritesheet_img.onload = start;
spritesheet_img.src = "spritesheet.png";

// Load Sprites
function start() {
  // Overwrite text
  // CanvasRenderingContext2D.prototype.fillText = function(args) {
  //   const [text, x, y] = args;
  //   this.drawImage()
  // }

  // Add Game Elements

  // SETUP Controllers
  sprite_text.init();
  const canvas_controller = new CanvasController();
  const debug_panel = new DebugPanel(); 
  const game_logic = new GameLogic();
  const ui_text = new UIText();
  // TODO: Combine entities?
  const sprites: Sprite[] = sprite_data_list.map(d => new Sprite(d));
  const game_entities: GameEntity[] = game_entities_data_list.map(d => new GameEntity(d));

  // Test text
  
  
  // Add custom cursor
  // const buttons_frame = spritesheet_json.frames.find((frame: SpritesheetFrame) => frame.filename === "cursor.aseprite").frame;
  // const cursor_canvas = canvasFromSpritesheet(buttons_frame, 48, 48);
  // document.body.style.cursor = `url(${cursor_canvas.toDataURL()}), none`;

  // Add text


  // 
  // Mouse Listeners
  // 
  document.addEventListener("mousemove", (e) => {
    // TODO: Throttle mousemove
    globals.mousepos.x = e.x;
    globals.mousepos.y = e.y;
  });
  window.addEventListener("click", () => {
    game_entities.find(entity => entity.is_hovering)
    ?.onClick();
  });
  
  // 
  // Render Loop
  // 
  (function draw(currentTime: number) {
    const delta = currentTime - previousTime;

    if (delta >= interval) {
      previousTime = currentTime - (delta % interval);

      // CURSOR
      document.body.style.cursor = 'undefined';

      // 
      // CLEAR CANVAS
      // 
      main_ctx.clearRect(0, 0, canvas_width, canvas_height);

      // 
      // UPDATE AND RENDER
      // 
      // 
      // Render sprites
      // TODO: sprites on background canvas?
      sprites.map(s => s.render(main_ctx));

      // Update logic for resource quantity
      game_logic.onUpdate(delta);

      // Update all entities
      game_entities.map((entity: GameEntity) => {
        entity.onUpdate();
        entity.render(main_ctx);
      });
      // 

      // Update the hitmask to check collisions
      hitmaskUpdate();

      // Render Cycle
      
      // UI Text
      ui_text.onUpdate();
      ui_text.render(main_ctx);

      // 
      // Although the game is currently set at 60fps, the state machine accepts a time passed to onUpdate
      // If you'd like to unlock the framerate, you can instead use an interval passed to onUpdate to 
      // adjust your physics so they are consistent across all frame rates.
      // If you do not limit your fps or account for the interval your game will be far too fast or far too 
      // slow for anyone with a different refresh rate than you.
      // gameStateMachine.getState().onUpdate(delta);

      debug_panel.onUpdate();
      // spriteController.render(main_ctx);
    }

    requestAnimationFrame(draw);
  })(0);

}


// Load spritesheet

 // Listen for mouse moves
//  c2d.addEventListener("mousemove", (event) => {
//   // Check whether point is inside circle
//   var path = new Path2D("M24 0h174v36h18v108h-18v30H93v24H24v-54H0V36h24V0Z");
//   const test = () => {
//     const isPointInPath = drawEngine.context.isPointInPath(path, event.offsetX, event.offsetY);
//     drawEngine.context.fillStyle = isPointInPath ? "green" : "red";
//     drawEngine.context.strokeStyle = 'black';
//     drawEngine.context.fill(path);
//     drawEngine.context.stroke(path);
//     requestAnimationFrame(test);

//   };
//   requestAnimationFrame(test);
// });

// document.addEventListener("click", () => {
//   game_entities.find(entity => entity.sprite?.is_hovering)
//     ?.onClick();
// });
