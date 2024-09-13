// https://github.com/narol1024/rollup-plugin-sprite/blob/master/index.js
// https://stackoverflow.com/questions/69626090/how-to-watch-public-directory-in-vite-project-for-hot-reload
// https://hackernoon.com/creating-a-custom-plugin-for-vite-the-easiest-guide
import { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync  } from 'fs';

export async function generateSpritesheet() {
  const source_dir = path.resolve('./', "src/assets/sprites/");
  const source_glob = source_dir + '/**';
  const target_name = "spritesheet";
  const target_png_path = path.resolve('./', `public/${target_name}.png`);
  const target_json_path = path.resolve('./', `src/data/${target_name}-data.json`);
  const target_json_ts_path = path.resolve('./', `src/data/${target_name}-data.ts`);

  console.log('Packing Aseprites: ');
  console.log(`Src Glob: ${source_glob}`);
  console.log(`Output PNG: ${target_png_path}`);
  console.log(`Output TS: ${target_json_ts_path}`);

  // 
  try {
    // Asesprite CLI
    // https://www.aseprite.org/docs/cli/#sheet-pack
    // Execute Asesprite packer
    const ase_exec = "/Applications/Aseprite.app/Contents/MacOS/aseprite";
    const binary = `${ase_exec} -b ${source_glob} --trim --sheet-pack --sheet ${target_png_path} --data ${target_json_path}`;
    execSync(binary);

    // Clean up Asesprite Spritesheet Output
    let sprite_names: string[] = [];
    const sprite_json = JSON.parse(await readFileSync(target_json_path, 'utf-8'));
    Object.entries(sprite_json.frames).forEach(([key, value]) => {
      let sprite_data = value as any; 
      delete sprite_json.frames[key];
      key = key.split(".ase")[0];
      sprite_json.frames[key] = sprite_data.frame;
      sprite_names.push(key);
    });

    console.log('Writing files...');

    // Write Spritesheet JSON as TS Object
    const spritesheet_json_typed = `
export type SpriteNames = ${sprite_names.map(v => "'" + v + "'").join(" | ")}
export type Spritesheet = {
  [key in SpriteNames]: Rect
}
export const spritesheet_data: Spritesheet = ${JSON.stringify(sprite_json.frames)};
`;
    await writeFileSync(target_json_ts_path, spritesheet_json_typed); 

    console.log('Done');
    return;
  } catch (error) {
    console.log("Asesprite Error: ", error);
  }
  return;
}

export default function asespritePlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'asesprite-packer',
    configResolved(_config) {
      config = _config;
    },
    async buildStart() {
      
    },
  };
};