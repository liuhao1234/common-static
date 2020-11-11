const { src,dest } = require('gulp');
const imagemin = require('gulp-imagemin');
function imageMin(){
    return src('images/*')
    .pipe(imagemin())
    .pipe(dest('img'))
}
exports.imageMin = imageMin