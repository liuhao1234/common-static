const { src,dest } = require('gulp');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const minCss = require('gulp-clean-css');
function compileStylus() {
    return src('stylus/style.styl')
    .pipe(stylus())
    .pipe(dest('css'))
    .pipe(minCss())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(dest('css'))
}
exports.compileStylus = compileStylus