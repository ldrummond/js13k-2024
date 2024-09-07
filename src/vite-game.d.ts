declare module '*.jpg';
declare module '*.png';
declare module '*.json';

type hsl = [number, number, number]

interface Point {
  x: number;
  y: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ResourceDetails {
  name: string;
  type: number;
  icon: string;
  limit: number;
  quantity: number;
  increase_per_second: number;
  locked_state: boolean;
  should_unlock: () => boolean;
}

interface GameData { [key in Resources]: ResourceDetails};

interface SpriteData {
  interactive: boolean; // TODO: Remove?
  x: number;
  y: number;
  w: number;
  // h: number;
  name: string;
  spritesheet_rect: Rect;
}