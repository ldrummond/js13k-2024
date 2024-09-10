declare module '*.jpg';
declare module '*.png';

type rgb = [number, number, number]
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
  x: number;
  y: number;
  w: number;
  mirrored?: number;
  spritesheet_rect: Rect[];
}