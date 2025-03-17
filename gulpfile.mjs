import gulp from 'gulp';
const { series, parallel, src, dest } = gulp;
// 各プラグイン読み込み
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import imagemin, {mozjpeg, svgo} from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import webP from 'gulp-webp';

// パス設定 ====================================
const srcPath = {
  img: './src/**/*',
  imgType: './src/**/*.{png,jpg,jpeg}'
}
const destPath = {
  img: './dest/',
}

// destディレクトリ内のファイルを削除 ============
const Clean = async () => {
  await deleteAsync([`${destPath.img}/**`, `!${destPath.img}`]);
};

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
      }),
    ],{
      verbose: true
    }))
  .pipe(dest(destPath.img))
);
export { ImgImagemin };

// webP変換 ====================================
const ImgWebp = () => {
  return src(srcPath.imgType, {encoding: false})
    .pipe(rename(function (path) {
      const ext = path.extname; // 元の拡張子（.jpg, .png など）
      path.basename += ext; // ファイル名に元の拡張子を追加
      path.extname = '.webp'; // 最終的な拡張子を .webp に変更
    }))
    .pipe(webP())
    .pipe(dest(destPath.img));
};

// 実行するタスク =============================
// const defaultTask = series( ImgImagemin );

// 実行用 ====================================
export default series(Clean, ImgImagemin, ImgWebp);