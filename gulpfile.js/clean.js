const cleanDir = require('gulp-clean-dir');
function cleanCssDir(cb){
    cleanDir("css")
    cb()
}
exports.cleanCssDir = cleanCssDir