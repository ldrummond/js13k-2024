import { defineConfig, IndexHtmlTransformContext, Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs/promises';
import typescriptPlugin from '@rollup/plugin-typescript';
import { OutputAsset, OutputChunk } from 'rollup';
import { Input, InputAction, InputType, Packer } from 'roadroller';
import CleanCSS from 'clean-css';
import { statSync } from 'fs';
const { execFileSync } = require('child_process');
import ect from 'ect-bin';
import { exec } from 'child_process';
import { compile, compileFromFile } from 'json-schema-to-typescript'

const htmlMinify = require('html-minifier');
const tmp = require('tmp');
const ClosureCompiler = require('google-closure-compiler').compiler;

export default defineConfig(({ command, mode }) => {
  const config = {
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    plugins: [
      asespritePlugin()
    ]
  };

  if (command === 'build') {
    // @ts-ignore
    config.esbuild = false;
    // @ts-ignore
    config.base = '';
    // @ts-ignore
    config.build = {
      minify: false,
      target: 'es2020',
      modulePreload: { polyfill: false },
      assetsInlineLimit: 800,
      assetsDir: '',
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          manualChunks: undefined,
          assetFileNames: `[name].[ext]`
        },
      }
    };
    // @ts-ignore
    config.plugins.push(typescriptPlugin(), closurePlugin(), roadrollerPlugin(), ectPlugin());
  }

  return config;
});

function closurePlugin(): Plugin {
  return {
    name: 'closure-compiler',
    // @ts-ignore
    renderChunk: applyClosure,
    enforce: 'post',
  }
}

// https://github.com/narol1024/rollup-plugin-sprite/blob/master/index.js
// https://stackoverflow.com/questions/69626090/how-to-watch-public-directory-in-vite-project-for-hot-reload
// https://hackernoon.com/creating-a-custom-plugin-for-vite-the-easiest-guide
function asespritePlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'asesprite-packer',
    async configResolved(_config) {
      config = _config;
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.ase') || file.endsWith('.aseprite')) {
        console.log('Sprite file updated. Reloading')
        server.ws.send({
          type: 'full-reload',          
          path: '*'
        });
        return [];
      }
    },
    async buildStart() {
      const source_dir = path.resolve(config.root, "src/assets/sprites/");
      const source_glob = source_dir + '/**';
      const target_name = "spritesheet";
      const target_png_path = path.resolve(config.root, `public/${target_name}.png`);
      const target_json_path = path.resolve(config.root, `src/${target_name}.json`);
      const target_json_ts_path = path.resolve(config.root, `src/${target_name}.ts`)

      // Wath these files
      this.addWatchFile(source_dir);

      try {
        // Asesprite CLI
        // https://www.aseprite.org/docs/cli/#sheet-pack
        const ase_exec = "/Applications/Aseprite.app/Contents/MacOS/aseprite";
        await new Promise((resolve, reject) => {
          // Execute Asesprite packer
          const binary = `${ase_exec} -b ${source_glob} --trim --sheet-pack --sheet ${target_png_path} --data ${target_json_path}`;
          exec(binary, (err) => {
            if(err) reject(err);
            resolve(null);
          });
        });

        // Clean up Asesprite Spritesheet Output
        let sprite_names: string[] = [];
        const sprite_json = JSON.parse(await fs.readFile(target_json_path, 'utf8'));
        Object.entries(sprite_json.frames).forEach(([key, value]) => {
          let sprite_data = value as any; 
          delete sprite_json.frames[key]
          key = key.split(".ase")[0]
          sprite_json.frames[key] = sprite_data.frame;
          sprite_names.push(key);
        })

        // Write Spritesheet JSON as TS Object
        const spritesheet_json_typed = `
export type SpriteNames = ${sprite_names.map(v => "'" + v + "'").join(" | ")}
export type Spritesheet = Record<SpriteNames, Rect>
export const spritesheet: Spritesheet = ${JSON.stringify(sprite_json.frames)}
`
        await fs.writeFile(target_json_ts_path, spritesheet_json_typed); 
      } catch (error) {
        console.log("Asesprite Error: ", error);
      }
    },
  }
}

/**
 * 
 * @param js 
 * @param chunk 
 * @returns 
 */
async function applyClosure(js: string, chunk: any) {
  const tmpobj = tmp.fileSync();
  // replace all consts with lets to save about 50-70 bytes
  // ts-ignore
  js = js.replaceAll('const ', 'let ');

  await fs.writeFile(tmpobj.name, js);
  const closureCompiler = new ClosureCompiler({
    js: tmpobj.name,
    externs: 'externs.js',
    compilation_level: 'ADVANCED',
    language_in: 'ECMASCRIPT_2020',
    language_out: 'ECMASCRIPT_2020',
  });
  return new Promise((resolve, reject) => {
    closureCompiler.run((_exitCode: string, stdOut: string, stdErr: string) => {
      if (stdOut !== '') {
        resolve({ code: stdOut });
      } else if (stdErr !== '') { // only reject if stdout isn't generated
        reject(stdErr);
        return;
      }

      console.warn(stdErr); // If we make it here, there were warnings but no errors
    });
  })
}

/**
 * 
 */
function roadrollerPlugin(): Plugin {
  return {
    name: 'vite:roadroller',
    transformIndexHtml: {
      enforce: 'post',
      transform: async (html: string, ctx?: IndexHtmlTransformContext): Promise<string> => {
        // Only use this plugin during build
        if (!ctx || !ctx.bundle) {
          return html;
        }

        const options = {
          includeAutoGeneratedTags: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          sortClassName: true,
          useShortDoctype: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          sortAttributes: true,
          minifyCSS: true,
        };

        const bundleOutputs = Object.values(ctx.bundle);
        const javascript = bundleOutputs.find((output) => output.fileName.endsWith('.js')) as OutputChunk;
        const css = bundleOutputs.find((output) => output.fileName.endsWith('.css')) as OutputAsset;
        const otherBundleOutputs = bundleOutputs.filter((output) => output !== javascript);
        if (otherBundleOutputs.length > 0) {
          otherBundleOutputs.forEach((output) => console.warn(`WARN Asset not inlined: ${output.fileName}`));
        }

        const cssInHtml = css ? embedCss(html, css) : html;
        const minifiedHtml = await htmlMinify.minify(cssInHtml, options);
        return embedJs(minifiedHtml, javascript);
      },
    },
  };
}

/**
 * Transforms the given JavaScript code into a packed version.
 * @param html The original HTML.
 * @param chunk The JavaScript output chunk from Rollup/Vite.
 * @returns The transformed HTML with the JavaScript embedded.
 */
async function embedJs(html: string, chunk: OutputChunk): Promise<string> {
  const scriptTagRemoved = html.replace(new RegExp(`<script[^>]*?src=[\./]*${chunk.fileName}[^>]*?></script>`), '');
  const htmlInJs = `document.write('${scriptTagRemoved}');` + chunk.code.trim();

  const inputs: Input[] = [
    {
      data: htmlInJs,
      type: 'js' as InputType,
      action: 'eval' as InputAction,
    },
  ];

  let options;
  if (process.env.USE_RR_CONFIG) {
    try {
      options = JSON.parse(await fs.readFile(`${__dirname}/roadroller-config.json`, 'utf-8'));
    } catch(error) {
      throw new Error('Roadroller config not found. Generate one or use the regular build option');
    }
  } else {
    options = { allowFreeVars: true };
  }

  const packer = new Packer(inputs, options);
  await Promise.all([
    fs.writeFile(`${path.join(__dirname, 'dist')}/output.js`, htmlInJs),
    packer.optimize(process.env.LEVEL_2_BUILD ? 2 : 0) // Regular builds use level 2, but rr config builds use the supplied params
  ]);
  const { firstLine, secondLine } = packer.makeDecoder();
  return `<script>\n${firstLine}\n${secondLine}\n</script>`;
}

/**
 * Embeds CSS into the HTML.
 * @param html The original HTML.
 * @param asset The CSS asset.
 * @returns The transformed HTML with the CSS embedded.
 */
function embedCss(html: string, asset: OutputAsset): string {
  const reCSS = new RegExp(`<link rel="stylesheet"[^>]*?href="[\./]*${asset.fileName}"[^>]*?>`);
  const code = `<style>${new CleanCSS({ level: 2 }).minify(asset.source as string).styles}</style>`;
  return html.replace(reCSS, code);
}

/**
 * Creates the ECT plugin that uses Efficient-Compression-Tool to build a zip file.
 * @returns The ECT plugin.
 */
function ectPlugin(): Plugin {
  return {
    name: 'vite:ect',
    writeBundle: async (): Promise<void> => {
      try {
        const files = await fs.readdir('dist/');
        const assetFiles = files.filter(file => {
          return !file.includes('.js') && !file.includes('.css') && !file.includes('.html') && !file.includes('.zip') && file !== 'assets';
        }).map(file => 'dist/' + file);
        const args = ['-strip', '-zip', '-10009', 'dist/index.html', ...assetFiles];
        const result = execFileSync(ect, args);
        console.log('ECT result', result.toString().trim());
        const stats = statSync('dist/index.zip');
        console.log('ZIP size', stats.size);
      } catch (err) {
        console.log('ECT error', err);
      }
    },
  };
}
