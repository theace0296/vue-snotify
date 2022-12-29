const path = require('path');
const { normalizePath } = require('vite');
const { createFilter } = require('@rollup/pluginutils');
const sass = require('sass');

/**
 * @typedef ConfigOptions
 * @property {string} [root]
 * @property {string} [entry]
 * @property {import('@rollup/pluginutils').FilterPattern} [exclude]
 * @property {import('@rollup/pluginutils').FilterPattern} [include]
 * @property {(file: string) => undefined | string} [formatFilePath]
 */

/**
 * @param {ConfigOptions} opt
 * @returns {import('vite').PluginOption}
 */
const copyAndTranspileSass = (opt) => {
  const maps = new Map();
  let root = opt?.root || process.cwd();
  const entry = opt?.entry || 'src';
  let sourceDir = normalizePath(path.resolve(root, entry));
  const include = opt?.include || [/\.(less|scss|css)$/];
  const exclude = opt?.exclude || [/node_modules/];
  return {
    name: 'vite-plugin-copy-and-transpile-sass',
    enforce: 'pre',
    apply: 'build',
    configResolved: (config) => {
      root = opt?.root || config.root || process.cwd();
      sourceDir = normalizePath(path.resolve(root, entry));
    },
    transform(code, id) {
      const filter = createFilter(include, exclude);
      if (!filter(id)) return;
      maps.set(id, code);
      return code;
    },
    generateBundle() {
      maps.forEach((code, id) => {
        let filename = id.replace(sourceDir, '').substring(1);
        filename = opt?.formatFilePath?.(filename) || filename;
        this.emitFile({
          type: 'asset',
          fileName: filename,
          source: code,
        });
      });
    },
  };
};

module.exports = copyAndTranspileSass;
