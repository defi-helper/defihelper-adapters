const fs = require('fs');
const path = require('path');
const cla = require('command-line-args');
const rideJS = require('@waves/ride-js');
const glob = require('tiny-glob');

const { config: configFile } = cla([{ name: 'config', alias: 'c', type: String, defaultValue: 'waves.config.js' }]);
const cwd = process.cwd();

const config = require(path.resolve(cwd, configFile));

glob(path.resolve(cwd, config.paths.sources, './**/*.ride')).then(async (files) => {
  console.info(`Compiling ${files.length} files with ${config.ride.version} version`);

  const artifacts = await Promise.all(
    files.map(async (sourceFile) => {
      const source = await fs.promises.readFile(sourceFile).then((v) => v.toString('utf-8'));
      const artifact = rideJS.compile(
        source,
        config.ride.version,
        config.ride.settings?.needCompaction ?? false,
        config.ride.settings?.removeUnusedCode ?? false
      );
      if (artifact.error) {
        return new Error(`Compilation error for ${sourceFile}: ${artifact.error}`);
      }

      return {
        result: artifact.result,
        sourceFile,
      };
    })
  );
  const builds = await Promise.all(
    artifacts
      .filter((a) => !(a instanceof Error))
      .map(async ({ result: { base64, size, complexity }, sourceFile }) => {
        const binPath = path.resolve(cwd, config.paths.artifacts, sourceFile, `${path.parse(sourceFile).name}.json`);
        try {
          await fs.promises.mkdir(path.parse(binPath).dir, { recursive: true });
          const data = JSON.stringify({ base64, size, complexity }, null, 4);
          return await fs.promises.writeFile(binPath, data, { flag: 'w' });
        } catch (e) {
          return new Error(`Artifact write error for ${binPath}: ${e.message}`);
        }
      })
  );
  const errors = [...artifacts.filter((a) => a instanceof Error), ...builds.filter((b) => b instanceof Error)];

  if (errors.length > 0) {
    errors.map((error) => console.error(error.message));
  } else {
    console.info('Compilation finished successfully');
  }
});

/*
const file = './automates/swopfi/autorestake.automate.ride';
(async () => {
  const content = await fs.promises.readFile(file).then((v) => v.toString('utf-8'));

  const bin = await rideJS.compile(content, 3);
  console.log(bin);
})();
*/
