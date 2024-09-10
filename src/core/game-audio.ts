/* eslint-disable guard-for-in */

import { globals } from "./constants";


const audio_context = new AudioContext();
audio_context.addEventListener("statechange", e => {
  console.log(e);
})
const gain_node = audio_context.createGain();
let background_music: boolean = false; 
let note_duration = .5;
let starttime = 0;

// Tiny music player
// https://xem.github.io/miniMusic/simple.html
// 
// Frequency (HZ): 70; 
// Duration (MS): 550; 
// 
export function startBackgroundMusic() {
  if(background_music) return;
  background_music = true; 
  audio_context.resume();
  const notes = [3,3,4,4,3,3,,2,2,2,2,1,0];
  const notes_duration = notes.length * note_duration * 1000 + 1000;
  
  // Play song
  notes.map(playNote)

  // Play again
  setInterval(() => {
    starttime += notes_duration;
    notes.map(playNote)
  }, notes_duration);
}

export function playNote(note: number | undefined, index: number) {
  if(note) {
    const oscillator = audio_context.createOscillator();
    oscillator.connect(gain_node);
    gain_node.connect(audio_context.destination);
    oscillator.start(starttime + index * note_duration)
    oscillator.frequency.setValueAtTime(70*1.06**(13-note), starttime + index * note_duration)
    gain_node.gain.setValueAtTime(globals.volume, starttime + index * note_duration),
    gain_node.gain.setTargetAtTime(.0001, starttime + index * note_duration + .48, .005),
    oscillator.stop(starttime + index * note_duration + .49);
  }
}


class AudioController {
  constructor() {

  }

  start() {
    
  }
}
