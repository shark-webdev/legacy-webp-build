import gulp from 'gulp';
const { series, parallel, src, dest, gulpWatch } = gulp;
// 各プラグイン読み込み
import imagemin, {mozjpeg, svgo} from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import webP from 'gulp-webp';

// パス設定 ====================================
const srcPath = {
  img: './src/**/*',
}
const destPath = {
  img: './dest/',
}
// 画像圧縮 ====================================
const ImgImagemin = () => (
  src(srcPath.img, {encoding: false})
    .pipe(imagemin([
      mozjpeg({quality: 90, progressive: true}),
      pngquant({ 
        quality: [0.8, 0.95],
        speed: 1,
      }),
      svgo({ 
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          },
          {
            name: 'cleanupIDs',
            active: false
          }
        ]
      })
    ],{
      verbose: true
    }))
  .pipe(dest(destPath.img))
);
export { ImgImagemin };

// 実行するタスク =============================
// const defaultTask = series( ImgImagemin );

// 実行用 ====================================
export default series(ImgImagemin);