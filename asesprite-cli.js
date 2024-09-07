const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const { promisify } = require('util');
const execPromise = promisify(childProcess.exec);

class AsepriteCli {
  packSprites(source_path, target_path, target_name) {
    const ase_exec = "/Applications/Aseprite.app/Contents/MacOS/aseprite";
    const binary = `${ase_exec} -b ${source_path} --sheet-pack --sheet --verbose ${target_path}/${target_name}.png --data ${target_path}/${target_name}.json`;
    console.log(source_path, `${target_path}/${target_name}.png`);
    console.log(binary);
    
    console.log(fs.readdirSync(source_path.split("*.aseprite")[0]));

    childProcess.exec(binary, (err) => {
      console.log(err);
      if(err) {
        reject(err);
      }
      else {
        // resolve();
      }
    });
    // return new Promise((resolve, reject) => {
      
    // });
  }
};

module.exports = new AsepriteCli();

