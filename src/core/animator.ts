import { globals } from "./constants";

export type ProgressCallback = (percent_complete: number, repeats_left: number) => void;
export type CompleteCallback = (repeats_left: number) => void;

/**
 * You know what its for 
 */
export class Animator {
  duration_ms: number;
  progress_callback?: ProgressCallback;
  complete_callback?: CompleteCallback;
  elapsed_time: number = 0;
  repeats_left: number;

  constructor(
    duration_ms: number,
    repeat_count: number,
    progress_callback?: ProgressCallback,
    complete_callback?: CompleteCallback
  ) {
    this.duration_ms = duration_ms;
    this.repeats_left = repeat_count;
    this.progress_callback = progress_callback;
    this.complete_callback = complete_callback;
    globals.animators.push(this);
  }

  // Call this method every frame with delta_time (time elapsed since the last frame)
  onUpdate(delta_time: number): void {
    if (this.repeats_left == 0) {
      return;
    }

    this.elapsed_time += delta_time;

    // Calculate the percentage of the duration that has been completed
    const percent_complete = Math.min(this.elapsed_time / this.duration_ms, 1);
    if(this.progress_callback) this.progress_callback(percent_complete, this.repeats_left);

    // Check if the animation duration is complete
    if (this.elapsed_time >= this.duration_ms) {
      if(this.complete_callback) this.complete_callback(this.repeats_left);
      this.repeats_left--;

      if (this.repeats_left != 0) {
        // Reset for the next repeat
        this.elapsed_time = 0;
      } else {
        // All repeats are complete; cancel the animation
        this.cancel();
      }
    }
  }

  // Cancel the animation
  cancel(): void {
    console.log(globals.animators);
    globals.animators.removeElement(this);
    console.log(globals.animators);
  }
}
