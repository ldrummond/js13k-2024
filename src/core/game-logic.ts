import { confidence, globals, hormones, knowledge, main_ctx, maturity, resource_list } from "./constants";
import Sprite from "./sprite";
import { State } from "./state";

export const game_data: GameData = {
  hormones,
  confidence,
  maturity,
  knowledge
};

export class GameLogic implements State {
  onUpdate(delta: number): void {
    // Update resources according to elapsed time
    resource_list.map(resource => {
      resource.quantity += (resource.increase_per_second * delta / 1000);
      if(resource.quantity > resource.limit) resource.quantity = resource.limit; 
    });
  };
}

// Game Loop
// Change resources by value per second
// Upate entities to show their state. 