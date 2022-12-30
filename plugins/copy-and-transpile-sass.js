const path = require('path');
const fs = require('fs');
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
 * @param {string} dir
 * @param {(dir: string) => boolean} [filter]
 * @param {(dir: string) => string} [transform]
 */
const getFilesRecursively = (
  dir,
  filter = () => true,
  transform = (s) => s
) => {
  if (!dir) {
    return [];
  }
  const files = [];
  if (fs.lstatSync(dir).isDirectory()) {
    fs.readdirSync(dir).forEach((f) => {
      files.push(...getFilesRecursively(path.join(dir, f), filter, transform));
    });
  } else if (filter(dir)) {
    files.push(transform(dir));
  }
  return files;
};

const copyFile = (src, dest) => {
  if (fs.cpSync) {
    return fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    if (!fs.existsSync(path.dirname(dest))) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
};

/**
 * @param {ConfigOptions} opt
 * @returns {import('vite').PluginOption}
 */
const copyAndTranspileSass = (opt) => {
  let root = opt?.root || process.cwd();
  const entry = opt?.entry || 'src';
  let sourceDir = normalizePath(path.resolve(root, entry));
  let relSourceDir = normalizePath(path.relative(root, sourceDir));
  const include = opt?.include || [/\.(less|scss|css)$/];
  const exclude = opt?.exclude || [/node_modules/];
  const filter = createFilter(include, exclude);
  let generated = false;

  return {
    name: 'vite-plugin-copy-and-transpile-sass',
    enforce: 'pre',
    apply: 'build',
    configResolved: (config) => {
      root = opt?.root || config.root || process.cwd();
      sourceDir = normalizePath(path.resolve(root, entry));
      relSourceDir = normalizePath(path.relative(root, sourceDir));
    },
    generateBundle() {
      if (!generated) {
        generated = true;
        const files = getFilesRecursively(
          sourceDir,
          (str) => filter(str),
          (str) => normalizePath(path.relative(process.cwd(), str))
        );
        for (const file of files) {
          let filename = file.replace(relSourceDir, 'dist/');
          filename = opt?.formatFilePath?.(filename) || filename;
          copyFile(file, filename);
          try {
            fs.writeFileSync(filename.replace(path.extname(filename), '.css'), sass.compile(file).css, 'utf8');
          } catch (e) {
            console.warn(e);
          }
        }
      }
    },
  };
};

module.exports = copyAndTranspileSass;
