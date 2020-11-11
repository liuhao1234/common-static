const { watch,series } = require('gulp');
const { cleanCssDir } = require('./clean');
const { imageMin } = require('./imageMin');
const { compileStylus } = require('./compile');

watch('stylus/*.styl',series(cleanCssDir,compileStylus));
exports.imageMin = imageMin;
exports.default = series(cleanCssDir,compileStylus);