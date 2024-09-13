import { char_border_inset, char_h, char_w, char_x, char_y, container_height, container_width, globals, hsl_darkred, hsl_offblack, interval, loading_canvas, loading_ctx, main_ctx, minion_lines, resource_list, rgb_red, spritesheet_img } from './core/constants';
import { GameEntity } from './core/game-entity';
import { UIText } from './core/ui-text';
import Sprite from './core/sprite';
import { hitmaskUpdate } from './core/hitmask';
import { game_entities_data_list } from './data/game-entities-data';
import { sprite_data_list } from './data/sprites-data';
import { Animator } from './core/animator';
import { renderBackground } from './core/background';
import { sprite_text } from './core/sprite-text';
import { ranHSL } from './core/utils';

// Load Main Spritesheet
// spritesheet_img.crossOrigin = "Anonymous";
spritesheet_img.onload = spritesheetLoaded;
const skip_loading = true; 

console.log("Load Spritesheet", spritesheet_img);
/**
 * Load spritesheet first
 */
function spritesheetLoaded() {
  // 
  // Initialize everything
  // 
  sprite_text.init();
  renderBackground();
  console.log("Rendered Background");
  
  // INIT TEXT BEFORE WRITING
  const ui_text = new UIText();
  globals.ui_text = ui_text;
  
  // Add Loading Text
  // sprite_text.fillText(loading_ctx, 'start puberty', window_width / 2, window_height / 2 - 30, 2, undefined, rgb_gold);
  setTimeout(() => {
    sprite_text.fillText(loading_ctx, 'Infernal Adolescence', 20, 60, 12, 0.12, undefined, rgb_red, 60);
  }, 100);

  // Init sprites
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

  // 
  // Draw character foreground mask
  // 
  const char_grad = main_ctx.createLinearGradient(char_x + char_border_inset, char_y + char_border_inset, char_w - char_border_inset * 2, char_h - char_border_inset * 2);
  char_grad.addColorStop(0, ranHSL(hsl_offblack, 0));
  char_grad.addColorStop(1, ranHSL(hsl_darkred, 0));
  // 
  function drawCharacterGradientMask() {
    main_ctx.fillStyle = char_grad;
    main_ctx.globalCompositeOperation = 'darken';
    main_ctx.globalAlpha = 0.6;
    main_ctx.fillRect(char_x + char_border_inset + 2, char_y + char_border_inset + 2, char_w - char_border_inset * 2, char_h - char_border_inset * 2);
    main_ctx.globalCompositeOperation = 'source-over';
    main_ctx.globalAlpha = 1;
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
      if(repeats_left == 1) {
        globals.ui_text?.updateMinionText(minion_lines['start']);
        // QUEUE
        globals.ui_text?.updateMinionText(minion_lines['encourage']);

        loading_canvas.remove();
      }
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
        globals.active_entity = undefined;
        globals.game_entities.map((entity: GameEntity) => {
          entity.onUpdate();
          entity.render(main_ctx);
        });
        
        // Update all animations
        globals.animators.map(animator => {
          animator.onUpdate(delta);
        });

        // Draw mask
        drawCharacterGradientMask();

        // Update the hitmask to check collisions
        hitmaskUpdate();

        // Render Cycle
      }

      requestAnimationFrame(draw);
    })(0);
  }
}
