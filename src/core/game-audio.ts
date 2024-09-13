////////////////////////////////////////////////
// 
// For Audio, needed some help from CHATGPT, and inspo from XEM 
// 
////////////////////////////////////////////////
import { globals } from "./constants";


type Chord = [number, number, number];

const audio_context = new AudioContext();

const chords_obj: { [key: string]: Chord } = {
  "C_major": [261.63, 329.63, 392.00], // C major (C, E, G)
  "G_major": [196.00, 246.94, 392.00], // G major (G, B, D)
  "F_major": [174.61, 220.00, 349.23], // F major (F, A, C)
  "A_minor": [220.00, 261.63, 329.63], // A minor (A, C, E)
  "D_minor": [293.66, 349.23, 440.00], // D minor (D, F, A)
  "B_diminished": [246.94, 311.13, 392.00], // B diminished (B, D, F)
  "D_major": [146.83, 185.00, 220.00], // D major (D, F#, A)
  "E_major": [164.81, 207.65, 246.94], // E major (E, G#, B)
  "C_minor": [130.81, 155.56, 196.00], // C minor (C, Eb, G)
  "F_minor": [174.61, 207.65, 261.63], // F minor (F, Ab, C)
  "G7": [196.00, 246.94, 293.66], // G7 (G, B, D, F)
  "Cmaj7": [130.81, 164.81, 196.00], // Cmaj7 (C, E, G, B)
  "E_diminished": [164.81, 207.65, 246.94], // E diminished (E, G, Bb)
  "G_minor": [196.00, 233.08, 293.66], // G minor (G, Bb, D)
  "ultra_low": [10, 20.60, 10], // Ultra-Low Chord (C0, E0, G0)
  "ultra_high": [4186.01, 5274.04, 6271.93] // Ultra-High Chord (C8, E8, G8)
};

/**
 * 
 * @param chords 
 * @param duration 
 * @param interval 
 * @param initial_volume 
 * @param falloff_duration 
 */
function playChordsLoop(chords: Chord[], duration: number, interval: number, initial_volume: number, falloff_duration: number) {
  let chord_index = 0;

  setInterval(() => {
      playChordWithFalloff(chords[chord_index], duration, initial_volume, falloff_duration);
      chord_index = (chord_index + 1) % chords.length; // Loop through chords
  }, interval);
}

/**
 * 
 */
export function playBackgroundMusic() {
  // Resume the audio context if it was suspended due to user interaction
  if (audio_context.state === 'suspended') {
      audio_context.resume();
  }
  // const song_chords_names = [
  //   "E_diminished",   // Edim
  //   "A_minor",        // Am
  //   "G_minor",        // Gm
  //   "E_diminished",   // Edim
  //   "F_minor",        // F
  //   "E_diminished",   // Bdim
  //   "G_minor",        // Gm
  //   "E_diminished",   // Bdim
  //   "C_minor",        // Cm
  //   "A_minor",         // Am (back to the start)
  // ];
  const song_chords_names = [
    "E_diminished",   // Edim
    "A_minor",        // Am
    "E_diminished",   // Edim
    "F_minor",        // F
    "E_diminished",   // Bdim
    "G_minor",        // Gm
    "E_diminished",   // Bdim
    "C_minor",        // Cm
  ];
  const song_chords = song_chords_names.map(chord_name => chords_obj[chord_name]);
  const chord_duration = 2; // Duration for each chord in seconds
  const initial_volume = 0.008; // Starting volume
  const falloff_duration = 1.0; // Falloff duration in seconds
  playChordsLoop(song_chords, chord_duration, 2000, initial_volume, falloff_duration); // Play chords in a loop with volume set to 0.1
}

/**
 * 
 * @param chord 
 * @param duration 
 * @param initial_volume 
 * @param falloff_duration 
 */
function playChordWithFalloff(chord: Chord, duration: number, initial_volume: number, falloff_duration: number) {
  const now = audio_context.currentTime;

  chord.map((freq) => {
      // Create an oscillator for each frequency
      const oscillator = audio_context.createOscillator();
      const gain_node = audio_context.createGain();

      oscillator.type = 'sine'; // Wave type: sine, square, triangle, sawtooth
      oscillator.frequency.setValueAtTime(freq, now); // Set frequency
      gain_node.gain.setValueAtTime(initial_volume, now); // Set initial volume

      // Create falloff effect: decrease the gain to 0 over `falloff_duration` seconds
      gain_node.gain.linearRampToValueAtTime(0, now + falloff_duration);

      // Connect oscillator to gain node and gain node to audio context destination
      oscillator.connect(gain_node);
      gain_node.connect(audio_context.destination);

      // Start and stop the oscillator
      oscillator.start(now);
      oscillator.stop(now + duration); // Stop after the specified duration

      // Clean up after playing
      oscillator.onended = () => {
          oscillator.disconnect();
          gain_node.disconnect();
      };
  });
}


/**
 * 
 */

export function playBookOpeningSound() {
  const book_opening_chord = chords_obj['G_major']; // G major chord for example
  const volume = globals.volume * 0.02;
  playChordWithFalloff(book_opening_chord, 1.5, volume, 1.0);
}

/**
 * 
 */
export function playMysteriousWhisper() {
  const chord = chords_obj["C_minor"]; // Minor chord for a mysterious tone
  const volume = globals.volume * 0.02;
  playChordWithFalloff(chord, 2.0, volume, 1.0); // Quick fade-out
}

/**
 * 
 */
export function playCreepyAmbience() {
  const chord = chords_obj["E_diminished"]; // Dissonant chord for a creepy effect
  const volume = globals.volume * 0.03;
  playChordWithFalloff(chord, 5.0, volume, 4.0); // Long fade-in and fade-out
}

/**
 * 
 */
export function playDistortedAttack() {
  const chord = chords_obj["D_minor"]; // Minor chord for a dark tone
  const volume = globals.volume * 0.01;
  playChordWithFalloff(chord, 1.0, volume, 0.5); // Sharp, quick fade-out
}

/**
 * 
 */
export function playWetSquelch() {
  const chord = chords_obj["E_diminished"]; // Dissonant chord for a squelchy effect
  const volume = globals.volume * 0.01;
  playChordWithFalloff(chord, 1, volume, 1); // Short duration, quick fade-out
}


/**
 * 
 *  Function to play a violin-like sound with adjustable pitch
 * 
 *  playViolinSound(440); // A4 note (standard tuning)
 *  playViolinSound(523.25); // C5 note
 *  playViolinSound(659.25); // E5 note
 * 
 * @param frequency 
 */
const violin_audio_context = new AudioContext();
export function playViolinSound(frequency: number, volume: number = 0.09) {
  // Ensure the audio context is not suspended (e.g., due to user inactivity)
  if (violin_audio_context.state === 'suspended') {
    violin_audio_context.resume();
  }
  const total_volume = globals.volume * volume;
  
  // Create an oscillator node
  const oscillator = violin_audio_context.createOscillator();
  oscillator.type = 'sawtooth'; // 'sawtooth' waveform to simulate a string-like sound
  oscillator.frequency.setValueAtTime(frequency, violin_audio_context.currentTime); // Set the desired pitch (frequency in Hz)

  // Create a gain node to control the volume and simulate the sound envelope
  const gainNode = violin_audio_context.createGain();
  gainNode.gain.setValueAtTime(0, violin_audio_context.currentTime); // Start at zero volume
  gainNode.gain.linearRampToValueAtTime(total_volume, violin_audio_context.currentTime + 0.05); // Quick attack to simulate a bow stroke
  gainNode.gain.exponentialRampToValueAtTime(0.001, violin_audio_context.currentTime + 1.5); // Slow decay to fade out

  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(violin_audio_context.destination);

  // Start the oscillator and stop it after 1.5 seconds
  oscillator.start(violin_audio_context.currentTime);
  oscillator.stop(violin_audio_context.currentTime + 1.5); // Stops after 1.5 seconds
}