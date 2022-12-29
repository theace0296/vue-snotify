const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
const del = require('del');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const inject = require('gulp-inject-string');
const inlineResources = require('./tools/gulp/inline-resources');
const ts = require('gulp-typescript');
const greplace = require('gulp-replace');

const rollup = require('gulp-better-rollup');
const replace = require('@rollup/plugin-replace');
const node = require('@rollup/plugin-node-resolve');
const cjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const vue = require('rollup-plugin-vue');

const { version, license, author, name } = require('./package.json');
const banner =
  '/**\n' +
  ' * ' +
  name +
  ' v' +
  version +
  '\n' +
  ' * (c) ' +
  new Date().getFullYear() +
  ' ' +
  author.name +
  ' <' +
  author.email +
  '>\n' +
  ' * @license ' +
  license +
  '\n' +
  ' */\n';

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, 'node_modules/.tmp');
const distFolder = path.join(rootFolder, 'dist');
const buildFolder = path.join(rootFolder, 'build');

const tsConfigOverrides = {
  declaration: true,
  module: 'es2015',
  target: 'es5',
  baseUrl: '.',
  stripInternal: true,
  emitDecoratorMetadata: true,
  experimentalDecorators: true,
  noImplicitAny: false,
  moduleResolution: 'node',
  outDir: './build',
  lib: ['es2015', 'dom'],
  includes: ['src/snotify.d.ts'],
  skipLibCheck: true,
};

const tsProject = ts.createProject({ ...tsConfigOverrides });

/**
 * Deletes the specified folderva
 * @param folders
 */
const deleteFolders = (folders) => {
  return del(folders, { force: true });
};

/**
 * Generate configuration object for rollup
 */
const getRollupOptions = (options = {}) => {
  return {
    ...options,
    input: `${srcFolder}/index.ts`,
    allowRealFiles: true,
    external: ['vue', 'Vue', ...(options?.external ?? [])],
    output: {
      ...options?.output,
      globals: {
        ...options?.output?.globals,
        typescript: 'ts',
        vue: 'Vue',
      },
    },
    plugins: [
      typescript({
        tsconfig: false,
        include: ['**/*.ts'],
        compilerOptions: { ...tsConfigOverrides },
      }),
      vue({
        defaultLang: { script: 'ts' },
      }),
      node({
        jsnext: true,
        module: true,
        main: true, // for commonjs modules that have an index.js
        browser: true,
      }),
      cjs({
        namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'vue-property-decorator': ['Component'],
        },
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      ...(options?.plugins ?? []),
    ],
  };
};

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function () {
  // Delete contents but not dist folder to avoid broken npm links
  // when dist directory is removed while npm link references it.
  return deleteFolders([distFolder + '/**', '!' + distFolder]);
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp
    .src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve().then(() => inlineResources(tmpFolder));
});

/**
 * 4. Run the typescript compiler, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */

gulp.task('typescript', function () {
  const tsResult = gulp.src(`${tmpFolder}/**/*.ts`).pipe(tsProject());

  return tsResult.dts.pipe(gulp.dest(buildFolder));
});

/**
 * 5. Replace static keyword in /.build declarations files? just because Vue interface doesn't accept that
 *    compiled modules to the /build folder.
 */

gulp.task('replaceService', function () {
  return gulp
    .src(`${buildFolder}/SnotifyService.d.ts`)
    .pipe(greplace('static', ''))
    .pipe(gulp.dest(buildFolder));
});

/**
 * 5. Inject Vue interface override
 */

gulp.task('injectDefinitions', function () {
  const fs = require('fs');
  return gulp
    .src(`${buildFolder}/index.d.ts`)
    .pipe(inject.prepend(fs.readFileSync(`${srcFolder}/vue.d.ts`, 'utf8')))
    .pipe(gulp.dest(buildFolder));
});

/**
 * 6. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', function () {
  return (
    gulp
      .src(`${buildFolder}/**/*.js`)
      // transform the files here.
      .pipe(
        rollup(
          getRollupOptions({
            output: {
              format: 'es',
            },
          })
        )
      )
      .pipe(inject.prepend(banner))
      .pipe(rename('vue-snotify.esm.js'))
      .pipe(gulp.dest(distFolder))
  );
});

/**
 * 7. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return (
    gulp
      .src(`${srcFolder}/**/*.ts`)
      // transform the files here.
      .pipe(
        rollup(
          getRollupOptions({
            output: {
              format: 'umd',
              exports: 'named',
              name: 'vue-snotify',
            },
          })
        )
      )
      .pipe(inject.prepend(banner))
      .pipe(rename('vue-snotify.js'))
      .pipe(gulp.dest(distFolder))
  );
});

/**
 * 8. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd:min', function () {
  return (
    gulp
      .src(`${buildFolder}/**/*.js`)
      // transform the files here.
      .pipe(
        rollup(
          getRollupOptions({
            output: {
              format: 'umd',
              exports: 'named',
              name: 'vue-snotify',
            },
          })
        )
      )
      .pipe(inject.prepend(banner))
      .pipe(rename('vue-snotify.min.js'))
      .pipe(gulp.dest(distFolder))
  );
});

/**
 * 9. Run rollup inside the /build folder to generate our CommonJS module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:cjs', function () {
  return (
    gulp
      .src(`${tmpFolder}/**/*.js`)
      // transform the files here.
      .pipe(
        rollup(
          getRollupOptions({
            output: {
              format: 'cjs',
              exports: 'named',
              name: 'vue-snotify',
            },
          })
        )
      )
      .pipe(inject.prepend(banner))
      .pipe(rename('vue-snotify.common.js'))
      .pipe(gulp.dest(distFolder))
  );
});

/**
 * 10. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because with don't need individual modules anymore, just the Flat ES module generated
 *    on steps 6,7,8,9.
 */
gulp.task('copy:build', function () {
  return gulp
    .src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 11. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`]).pipe(gulp.dest(distFolder));
});

/**
 * 12. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp
    .src([path.join(rootFolder, 'README.md')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 13. Delete /.tmp folder
 */
gulp.task('clean:tmp', function () {
  return deleteFolders([tmpFolder]);
});

/**
 * 14. Delete /build folder
 */
gulp.task('clean:build', function () {
  return deleteFolders([buildFolder]);
});

/**
 * 15. Compile styles into separate bundle
 */
gulp.task('styles:compile', function () {
  return gulp
    .src([`${srcFolder}/styles/*.scss`])
    .pipe(sass().on('error', sass.logError))
    .pipe(
      postcss([
        autoprefixer({
          browsers: ['last 2 versions', 'safari >= 7'],
          cascade: false,
        }),
      ])
    )
    .pipe(gulp.dest(`${distFolder}/styles`));
});

/**
 * 16. Copy styles sources to our dist folder
 */
gulp.task('styles:copy', function () {
  return gulp
    .src([`${srcFolder}/styles/**`])
    .pipe(gulp.dest(`${distFolder}/styles`));
});

/**
 * 17. Copy manifest, readme, to our dist folder
 */
gulp.task('copy', gulp.parallel('copy:manifest', 'copy:readme'));

gulp.task(
  'compile',
  gulp.series(
    'copy:source',
    'inline-resources',
    'typescript',
    'copy:build',
    gulp.parallel('rollup:fesm', 'rollup:umd', 'rollup:cjs', 'rollup:umd:min'),
    (done) => {
      console.log('LIBRARY: compilation finished successfully');
      done();
    }
  )
);

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  gulp.watch(`${srcFolder}/**/*`, gulp.parallel('compile'));
  gulp.watch(`${srcFolder}/styles/**`, gulp.parallel('styles:build'));
});

gulp.task('clean', gulp.parallel('clean:dist', 'clean:tmp', 'clean:build'));

gulp.task(
  'styles:build',
  gulp.parallel('styles:compile', 'styles:copy', (done) => {
    console.log('STYLES: compilation finished successfully');
    done();
  })
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    'compile',
    'copy',
    'clean:build',
    'clean:tmp',
    'styles:build'
  )
);

gulp.task('default', gulp.series('build', 'watch'));
