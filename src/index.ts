import { drawEngine } from './core/draw-engine';
import { menuState } from './game-states/menu.state';
import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';

createGameStateMachine(menuState);

drawEngine.initialize(c2d);

let previousTime = 0;
const interval = 1000 / 60;

(function draw(currentTime: number) {
  const delta = currentTime - previousTime;

  if (delta >= interval) {
    previousTime = currentTime - (delta % interval);

    controls.queryController();
    drawEngine.context.clearRect(0, 0, drawEngine.width, drawEngine.height);
    gameStateMachine.getState().onUpdate(currentTime);
  }
  requestAnimationFrame(draw);
})(0);
