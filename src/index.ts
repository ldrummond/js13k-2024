import { container_height, container_width, globals, interval, loading_canvas, loading_ctx, main_ctx, resource_list, spritesheet_img } from './core/constants';
import { GameEntity } from './core/game-entity';
import { UIText } from './core/ui-text';
import Sprite from './core/sprite';
import { hitmaskUpdate } from './core/hitmask';
import { game_entities_data_list } from './data/game-entities-data';
import { sprite_data_list } from './data/sprites-data';
import { Animator } from './core/animator';
import { renderBackground } from './core/background';
import { sprite_text } from './core/sprite-text';

// Load Main Spritesheet
// spritesheet_img.crossOrigin = "Anonymous";
spritesheet_img.onload = spritesheetLoaded;
const skip_loading = true; 

console.log("Load Spritesheet", spritesheet_img);
/**
 * Load spritesheet first
 */
function spritesheetLoaded() {
  // Add Loading Text
  // sprite_text.fillText(loading_ctx, 'start puberty', window_width / 2, window_height / 2 - 30, 2, undefined, rgb_gold);
  console.log("On Loaded Spritesheet");

  main_ctx.fillStyle = 'blue';
  main_ctx.fillRect(0, 0, 100, 100);
  main_ctx.drawImage(spritesheet_img, 0, 0, 100, 100, 0, 0, 100, 100);

  // 
  // Initialize everything
  // 
  sprite_text.init();
  renderBackground();
  console.log("Rendered Background");
  
  const ui_text = new UIText();
  sprite_data_list.map(d => globals.sprites.push(new Sprite(d)));
  game_entities_data_list.map(d => globals.game_entities.push(new GameEntity(d)));

  document.addEventListener("mousemove", (e) => {
    // TODO: Throttle mousemove
    globals.mousepos.x = e.x;
    globals.mousepos.y = e.y;
  });
  
  console.log("After Initialized");

  // 
  // Remove loader and get ready to start
  // 
  document.getElementById("loading")?.remove();
  const start_button = document.getElementById("start")!;
  if(skip_loading) {
    start();
  }
  else {
    start_button.addEventListener("click", start);
  }


  /**
   * Start Game Loop
   */
  function start() {
    console.log("Start Function");

    // 
    start_button.remove();
    const steps = skip_loading ? 1 : 40;
    loading_ctx.fillStyle = 'red';
   
    new Animator(100, steps, undefined, (repeats_left: number) => {
      const step_percent = 1 - (repeats_left / steps); 
      loading_ctx.clearRect(0, 0, loading_canvas.width, loading_canvas.height * step_percent);
      if(repeats_left == 1) loading_canvas.remove();
    });

    // Add custom cursor
    // const buttons_frame = spritesheet_json.frames.find((frame: SpritesheetFrame) => frame.filename === "cursor.aseprite").frame;
    // const cursor_canvas = canvasFromSpritesheet(buttons_frame, 48, 48);
    // document.body.style.cursor = `url(${cursor_canvas.toDataURL()}), none`;

    // 
    // Mouse Listeners
    // 
    window.addEventListener("click", () => {
      globals.game_entities.find(entity => entity.is_hovering)
      ?.onClick();
    });
    
    // 
    // Render Loop
    // 
    let previousTime = 0;
    // 
    (function draw(currentTime: number) {
      const delta = currentTime - previousTime;
      globals.elapsed += delta;

      if (delta >= interval) {
        previousTime = currentTime - (delta % interval);

        // CURSOR
        document.body.style.cursor = globals.cursor;
        globals.cursor = 'default';

        // 
        // CLEAR CANVAS
        // 
        main_ctx.clearRect(0, 0, container_width, container_height);
  
        // 
        // UPDATE AND RENDER
        // 
        // 
                
        // UI Text
        ui_text.onUpdate();
        ui_text.render(main_ctx);

        // Render sprites
        // TODO: sprites on background canvas?
        globals.sprites.map(s => s.render(main_ctx));

        // Update logic for resource quantity
        resource_list.map(resource => {
          resource.quantity += (resource.increase_per_second * delta / 1000);
          if(resource.quantity > resource.limit) resource.quantity = resource.limit; 
        });
        
        // Update all entities
        globals.game_entities.map((entity: GameEntity) => {
          entity.onUpdate();
          entity.render(main_ctx);
        });
        
        // Update all animations
        globals.animators.map(animator => {
          animator.onUpdate(delta);
        });

        // Update the hitmask to check collisions
        hitmaskUpdate();

        // Render Cycle
      }

      requestAnimationFrame(draw);
    })(0);
  }
}
