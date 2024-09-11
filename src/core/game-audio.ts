/* eslint-disable guard-for-in */

import { globals } from "./constants";

const audio_context = new AudioContext();
audio_context.addEventListener("statechange", e => {
  console.log(e);
});
const gain_node = audio_context.createGain();
let background_music: boolean = false; 
let note_duration = .5;
let starttime = 0;

/**
 * 
 * XEM: Tiny Music Player
 * https://xem.github.io/miniMusic/simple.html
 * 
 * Frequency (HZ): 70; 
 * Duration (MS): 550; 
 * @returns 
 */
export function startBackgroundMusic() {
  if(background_music) return;
  background_music = true; 
  audio_context.resume();
  const notes = [3,3,4,4,3,3,,2,2,2,2,1,0];
  const notes_duration = notes.length * note_duration * 1000 + 1000;
  
  // Play song
  notes.map(playNote);

  // Play again
  setInterval(() => {
    starttime += notes_duration;
    notes.map(playNote);
  }, notes_duration);
}

/**
 * XEM: Tiny Music Player
 * https://xem.github.io/miniMusic/simple.html
 * 
 * @param note 
 * @param index 
 */
export function playNote(note: number | undefined, index: number) {
  audio_context.resume();
  if(note) {
    console.log(note);
    
    const oscillator = audio_context.createOscillator();
    oscillator.connect(gain_node);
    gain_node.connect(audio_context.destination);
    oscillator.start(starttime + index * note_duration);
    oscillator.frequency.setValueAtTime(70*1.06**(13-note), starttime + index * note_duration);
    gain_node.gain.setValueAtTime(globals.volume, starttime + index * note_duration),
    gain_node.gain.setTargetAtTime(.0001, starttime + index * note_duration + .48, .005),
    oscillator.stop(starttime + index * note_duration + .49);
  }
}

/**
 * 
 * XEM: MiniSoundEditor
 * 
 * @param soundFn 
 */
const t=(i: number, n: number)=>(n-i)/n;

/**
 * Nudge Sound
 */
export const soundNudge = (i:number): number | null => {
  var n=6e3;
  if (i > n) return null;
  var q = t(i,n);
  return Math.sin(i*0.01*Math.sin(0.009*i+Math.sin(i/200))+Math.sin(i/100))*q*q;
};

/**
 * 
 * XEM: MiniSoundEditor
 * 
 * @param soundFn 
 */
export function playSoundFn(soundFn: (i: number) => number | null) {
  const ac = new AudioContext();
  const channels = 1; 
  const length = 96000;
  const sample_rate = 48000;
  const audio_buffer = ac.createBuffer(channels, length, sample_rate);
  let buffer_data = audio_buffer.getChannelData(0);
  for(let i = length; i--;) {
    let sound_data = soundFn(i);
    if(sound_data) {buffer_data[i] = sound_data;}
    let source = audio_context.createBufferSource();
    source.buffer = audio_buffer;
    source.connect(audio_context.destination);
    source.start();
  }
}

/**
 * 
 * Function to play a violin-like sound with adjustable pitch
 * 
 *  playViolinSound(440); // A4 note (standard tuning)
 *  playViolinSound(523.25); // C5 note
 *  playViolinSound(659.25); // E5 note
 * 
 * @param frequency 
 */
export function playViolinSound(frequency: number) {
  // Ensure the audio context is not suspended (e.g., due to user inactivity)
  if (audio_context.state === 'suspended') {
    audio_context.resume();
  }
  const volume = globals.volume * 0.5;

  // Create an oscillator node
  const oscillator = audio_context.createOscillator();
  oscillator.type = 'sawtooth'; // 'sawtooth' waveform to simulate a string-like sound
  oscillator.frequency.setValueAtTime(frequency, audio_context.currentTime); // Set the desired pitch (frequency in Hz)

  // Create a gain node to control the volume and simulate the sound envelope
  const gainNode = audio_context.createGain();
  gainNode.gain.setValueAtTime(0, audio_context.currentTime); // Start at zero volume
  gainNode.gain.linearRampToValueAtTime(volume, audio_context.currentTime + 0.05); // Quick attack to simulate a bow stroke
  gainNode.gain.exponentialRampToValueAtTime(0.001, audio_context.currentTime + 1.5); // Slow decay to fade out

  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(audio_context.destination);

  // Start the oscillator and stop it after 1.5 seconds
  oscillator.start(audio_context.currentTime);
  oscillator.stop(audio_context.currentTime + 1.5); // Stops after 1.5 seconds
}